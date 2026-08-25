async function findAvailableModel(apiKey) {
  const versions = ['v1beta', 'v1'];
  for (const v of versions) {
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/${v}/models?key=${apiKey}`);
      const data = await res.json();
      if (data.models) {
        console.log(`Version ${v} models:`, data.models.map(m => m.name));
        const usable = data.models.filter(m => m.supportedGenerationMethods?.includes('generateContent'));
        console.log(`Usable on ${v}:`, usable.map(m => m.name));
      } else {
        console.log(`Version ${v} error:`, data);
      }
    } catch (e) {
      console.error(`Version ${v} fetch error:`, e.message);
    }
  }
}
console.log("Helper ready");
