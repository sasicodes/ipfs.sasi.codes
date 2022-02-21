import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import uploadToIPFS from './upload'
import toast from 'react-hot-toast'

function App() {
  const [uploading, setUploading] = useState(false)
  const [ipfsData, setIpfsData] =
    useState<{ hash: string; url: string; name: string; size: string }>()

  const upload = async (file: File) => {
    const data = await uploadToIPFS(file)
    setUploading(false)
    setIpfsData(data)
    toast.success('File uploaded 🎉')
  }

  const onDrop = useCallback((file) => {
    setUploading(true)
    upload(file[0])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: '.png,.jpg,.jpeg,.gif',
    maxFiles: 1
  })

  return (
    <div>
      <h1 className="text-3xl font-bold">IPFS uploader</h1>
      <p className="mb-5 text-base md:mb-6">You can upload images.</p>
      <div
        {...getRootProps()}
        className={`${
          isDragActive ? 'border-green-600' : 'border-gray-700'
        } p-10 my-6 text-center border-4 border-dotted rounded-lg cursor-pointer`}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <p>Uploading...</p>
        ) : isDragActive ? (
          <p>Drop here</p>
        ) : (
          <p>Drag & drop file here, or click to select</p>
        )}
      </div>
      {ipfsData ? (
        <div className="mt-16 bg-gray-800 rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <span className="select-all">{ipfsData.hash}</span>
            <CopyToClipboard
              text={ipfsData.hash}
              onCopy={() => toast.success('Hash copied 🎉')}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 cursor-copy opacity-60 hover:opacity-100"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </CopyToClipboard>
          </div>
          <div className="flex items-center justify-between mb-10 overflow-hidden truncate">
            <a
              target="_blank"
              className="hover:text-blue-400"
              href={ipfsData.url}
            >
              {ipfsData.url}
            </a>
            <CopyToClipboard
              text={ipfsData.url}
              onCopy={() => toast.success('URL copied 🎉')}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 cursor-copy opacity-60 hover:opacity-100"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </CopyToClipboard>
          </div>
          <div className="flex items-center overflow-hidden">
            <img
              src={ipfsData.url}
              alt="preview"
              className="rounded-xl h-96"
              draggable={false}
            />
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default App
