import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

function remotionRenderPlugin(): Plugin {
  let renderJob: {
    status: 'idle' | 'rendering' | 'completed' | 'error';
    progress: number;
    message: string;
    videoPath?: string;
    error?: string;
  } = {
    status: 'idle',
    progress: 0,
    message: 'Sẵn sàng'
  };

  return {
    name: 'remotion-render-api',
    configureServer(server) {
      // 1. POST /api/render-video
      server.middlewares.use('/api/render-video', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end('Method Not Allowed');
          return;
        }

        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
        });

        req.on('end', () => {
          try {
            const data = JSON.parse(body);
            const storyboard = data.storyboard;
            const showSubtitles = data.showSubtitles ?? true;

            const outDir = path.resolve(process.cwd(), 'out');
            if (!fs.existsSync(outDir)) {
              fs.mkdirSync(outDir, { recursive: true });
            }

            const propsFile = path.resolve(outDir, 'temp_props.json');
            fs.writeFileSync(propsFile, JSON.stringify({ storyboard, showSubtitles }, null, 2), 'utf-8');

            const videoFilename = `demo_${Date.now()}.mp4`;
            const outVideoPath = path.resolve(outDir, videoFilename);

            renderJob = {
              status: 'rendering',
              progress: 0,
              message: 'Khởi tạo render video...'
            };

            const isWindows = process.platform === 'win32';
            const cmd = isWindows ? 'npx.cmd' : 'npx';
            const args = [
              'remotion',
              'render',
              'src/remotion/index.ts',
              'CodeDemo',
              outVideoPath,
              `--props=${propsFile}`,
              '--concurrency=4'
            ];

            const proc = spawn(cmd, args, { cwd: process.cwd(), shell: true });

            proc.stdout.on('data', (dataChunk: Buffer) => {
              const text = dataChunk.toString();
              const renderedMatch = text.match(/Rendered\s+(\d+)\/(\d+)/i);
              const encodedMatch = text.match(/Encoded\s+(\d+)\/(\d+)/i);

              if (renderedMatch) {
                const current = parseInt(renderedMatch[1], 10);
                const total = parseInt(renderedMatch[2], 10);
                const percent = Math.min(85, Math.round((current / total) * 85));
                renderJob.progress = percent;
                renderJob.message = `Đang render khung hình ${current}/${total} (${percent}%)`;
              } else if (encodedMatch) {
                const current = parseInt(encodedMatch[1], 10);
                const total = parseInt(encodedMatch[2], 10);
                const percent = 85 + Math.round((current / total) * 15);
                renderJob.progress = Math.min(99, percent);
                renderJob.message = `Đang đóng gói video MP4 (${percent}%)`;
              } else if (text.includes('Bundling')) {
                renderJob.message = 'Đang đóng gói tài nguyên giao diện...';
              }
            });

            proc.stderr.on('data', (errChunk: Buffer) => {
              console.warn('[Remotion Render Log]:', errChunk.toString());
            });

            proc.on('close', (code) => {
              if (code === 0 && fs.existsSync(outVideoPath)) {
                renderJob = {
                  status: 'completed',
                  progress: 100,
                  message: 'Render hoàn tất 100%!',
                  videoPath: `/api/download-video?file=${encodeURIComponent(videoFilename)}`
                };
              } else {
                renderJob = {
                  status: 'error',
                  progress: 0,
                  message: 'Có lỗi trong quá trình render video',
                  error: `Quá trình kết thúc với mã lỗi ${code}`
                };
              }
            });

            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true, message: 'Đã bắt đầu tiến trình render' }));
          } catch (err: any) {
            res.statusCode = 500;
            res.end(JSON.stringify({ success: false, error: err.message }));
          }
        });
      });

      // 2. GET /api/render-status
      server.middlewares.use('/api/render-status', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(renderJob));
      });

      // 3. GET /api/download-video
      server.middlewares.use('/api/download-video', (req, res) => {
        const url = new URL(req.url || '', `http://${req.headers.host}`);
        const filename = url.searchParams.get('file') || 'video.mp4';
        const filePath = path.resolve(process.cwd(), 'out', path.basename(filename));

        if (fs.existsSync(filePath)) {
          res.setHeader('Content-Disposition', `attachment; filename="${path.basename(filename)}"`);
          res.setHeader('Content-Type', 'video/mp4');
          fs.createReadStream(filePath).pipe(res);
        } else {
          res.statusCode = 404;
          res.end('Video not found');
        }
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), remotionRenderPlugin()],
  server: {
    port: 3000,
    host: '0.0.0.0',
    open: false
  }
});
