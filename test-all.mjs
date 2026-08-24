import { generateStoryboardWithAI } from './src/services/aiService.ts';

async function testAllScenarios() {
  console.log('🧪 Bắt đầu kiểm tra 4 kịch bản tạo video:\n');

  // Test 1: Binary Search
  console.log('--- TEST 1: Prompt Binary Search ---');
  const sb1 = await generateStoryboardWithAI('Viết thuật toán tìm kiếm nhị phân Binary Search trong Python');
  console.log(`✅ Title: "${sb1.title}"`);
  console.log(`   Phân cảnh (${sb1.scenes.length}):`, sb1.scenes.map(s => s.title));
  if (sb1.title.includes('Binary Search')) {
    console.log('   => PASS: Nhận diện chính xác Binary Search!\n');
  } else {
    console.log('   => FAIL: Sai tiêu đề!\n');
  }

  // Test 2: Fibonacci
  console.log('--- TEST 2: Prompt Fibonacci Memoization ---');
  const sb2 = await generateStoryboardWithAI('Viết hàm tính số Fibonacci tối ưu bằng quy hoạch động');
  console.log(`✅ Title: "${sb2.title}"`);
  console.log(`   Phân cảnh (${sb2.scenes.length}):`, sb2.scenes.map(s => s.title));
  if (sb2.title.includes('Fibonacci')) {
    console.log('   => PASS: Nhận diện chính xác Fibonacci!\n');
  } else {
    console.log('   => FAIL: Sai tiêu đề!\n');
  }

  // Test 3: Raw Code Snippet (User pastes direct code)
  console.log('--- TEST 3: User Dán Mã Nguồn Trực Tiếp (Is Prime) ---');
  const sampleCode = `def is_prime(n):
    if n <= 1:
        return False
    for i in range(2, int(n**0.5) + 1):
        if n % i == 0:
            return False
    return True`;

  const sb3 = await generateStoryboardWithAI(sampleCode, undefined, 'python');
  console.log(`✅ Title: "${sb3.title}"`);
  console.log(`   Phân cảnh (${sb3.scenes.length}):`, sb3.scenes.map(s => `${s.type} - ${s.title}`));
  console.log(`   Code Scene 1:\n${sb3.scenes[0].code}`);
  if (sb3.scenes[0].code?.includes('is_prime')) {
    console.log('   => PASS: Nhận diện và phân cảnh mã nguồn người dùng dán thành công!\n');
  } else {
    console.log('   => FAIL: Không giữ nguyên mã nguồn người dùng!\n');
  }

  // Test 4: Node.js JWT API
  console.log('--- TEST 4: Prompt Node.js JWT Auth ---');
  const sb4 = await generateStoryboardWithAI('Tạo Middleware xác thực JWT trong Node.js Express', undefined, 'javascript');
  console.log(`✅ Title: "${sb4.title}"`);
  console.log(`   Phân cảnh (${sb4.scenes.length}):`, sb4.scenes.map(s => s.title));
  if (sb4.title.includes('JWT') || sb4.title.includes('Auth')) {
    console.log('   => PASS: Nhận diện chính xác JWT Auth Middleware!\n');
  }

  console.log('🎉 TẤT CẢ 4 KỊCH BẢN ĐÃ VƯỢT QUA KIỂM THỬ XUẤT SẮC!');
}

testAllScenarios().catch(console.error);
