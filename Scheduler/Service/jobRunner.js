import fs from 'fs';
import XLSX from 'xlsx';
export const executeQuery = async (connection, job) => {
  const { name, query, extension } = job;
  if (!query) return;
  console.log('Executing Query ', query);
  try {
    const [results] = await connection.query(query);
    if (extension) {
      generateFile(results, name, extension);
    }
    // Console.timeEnd()
  } catch (err) {
    console.log(err);
  }
};

export const executeCurl = (curl) => {
  console.log('Executing Curl ', curl);
};

const formatJSON = (data, extension) => {
  if (extension === 'json') {
    return JSON.stringify(data);
  }
  if (typeof data === 'object') {
    const formatterData = Array.isArray(data) ? data : [data];
    const csv = formatterData.map((row) => Object.values(row));
    csv.unshift(Object.keys(data[0]));
    return csv.join('\n');
  } return JSON.stringify(data);
};

const generateFile = (data, name, extension) => {
  let fileName = '';
  if (name) fileName = `${name}_${new Date().toISOString()}`;
  else fileName = `${new Date().toISOString()}.${extension[0]}` === '.' ? extension.slice(1) : extension;
  console.log(`Generating file with name: ${fileName}`);
  const outputPath = `./Resource/Reports/${fileName}`;

  try {
    if (extension === 'xlsx') {
      const workSheet = XLSX.utils.json_to_sheet(data);
      const workBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workBook, workSheet, 'Report');
      return XLSX.writeFile(workBook, outputPath);
    }
    const output = fs.createWriteStream(outputPath, { encoding: 'utf8' });
    output.write(formatJSON(data, extension));
    return output.end();
  } catch (err) {
    console.log(err);
  }
};
