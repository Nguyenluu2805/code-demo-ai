function pickBestModel(modelList) {
  // Sort models: prefer flash, then pro, then anything
  const sorted = [...modelList].sort((a, b) => {
    const aName = typeof a === 'string' ? a : a.name;
    const bName = typeof b === 'string' ? b : b.name;
    if (aName.includes('flash') && !bName.includes('flash')) return -1;
    if (!aName.includes('flash') && bName.includes('flash')) return 1;
    return 0;
  });
  return sorted.map(m => typeof m === 'string' ? m : m.name);
}

const testList = [
  { name: 'models/gemini-pro', supportedGenerationMethods: ['generateContent'] },
  { name: 'models/gemini-1.5-flash-8b', supportedGenerationMethods: ['generateContent'] },
  { name: 'models/embedding-001', supportedGenerationMethods: ['embedContent'] }
];

const usable = testList.filter(m => m.supportedGenerationMethods.includes('generateContent'));
console.log("Picked:", pickBestModel(usable));
