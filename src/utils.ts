export const getFileType = (type: string) => {
  const content = type.split('/')[0]
  return content
}
