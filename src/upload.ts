const uploadToIPFS = async (data: File) => {
  const formData = new FormData()
  formData.append('file', data, data.name)
  const upload = await fetch('https://ipfs.infura.io:5001/api/v0/add', {
    method: 'POST',
    body: formData
  })
  const { Hash, Name, Size }: { Hash: string; Name: string; Size: string } =
    await upload.json()

  return {
    url: `https://ipfs.infura.io/ipfs/${Hash}`,
    hash: Hash,
    name: Name,
    size: Size,
    type: data.type
  }
}

const uploadDataToIPFS = async (data: string) => {
  try {
    const formData = new FormData()
    formData.append('data', data)
    const upload = await fetch('https://ipfs.infura.io:5001/api/v0/add', {
      method: 'POST',
      body: formData
    })
    const { Hash, Name, Size }: { Hash: string; Name: string; Size: string } =
      await upload.json()
    return {
      url: `https://ipfs.infura.io/ipfs/${Hash}`,
      hash: Hash,
      name: Name,
      size: Size,
      type: 'application/json'
    }
  } catch (error) {
    console.error(error)
  }
}

export { uploadDataToIPFS, uploadToIPFS }
