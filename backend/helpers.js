function extractBufferData(buffer, boundary) {
  const entries = [];
  const bufferForBoundary = Buffer.from(`--${boundary}`);
  let start = 0;
  let end = buffer.indexOf(bufferForBoundary, start);

  while (end !== -1) {
    entries.push(buffer.slice(start, end));
    start = end + bufferForBoundary.length + 2; // Skip boundary and \r\n
    end = buffer.indexOf(bufferForBoundary, start);
  }
  return entries;
}

function getContentDisposition(headerString) {
  const headerLines = headerString.split('\r\n');
  const contentDisposition = headerLines.find((item) =>
    item.includes('Content-Disposition'),
  );
  return contentDisposition?.split(': ')?.[1];
}

function getFileExtension(fileName) {
  const splitted = fileName?.split('.');
  if (splitted?.length < 2) {
    return null;
  }
  return splitted[splitted.length - 1];
}

module.exports = {
  extractBufferData,
  getContentDisposition,
  getFileExtension,
};
