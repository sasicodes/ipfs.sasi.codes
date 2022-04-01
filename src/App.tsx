import { useCallback, useState } from 'react'
import { FileRejection, useDropzone } from 'react-dropzone'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import uploadToIPFS from './upload'
import toast from 'react-hot-toast'

function App() {
  const [uploading, setUploading] = useState(false)
  const [ipfsData, setIpfsData] =
    useState<{ hash: string; url: string; name: string; size: string }>()

  const upload = async (file: File) => {
    try {
      const data = await uploadToIPFS(file)
      setUploading(false)
      setIpfsData(data)
      toast.success('File uploaded 🎉')
    } catch (error) {
      toast.error('Something went wrong')
      setUploading(false) // if upload fails, set uploading state to false
    }
  }

  const onDrop = useCallback((file) => {
    setUploading(true)
    upload(file[0])
  }, [])

  const onDropRejected = (fileRejections: FileRejection[]) => {
    fileRejections[0].errors.forEach((error) => toast.error(error.message)) // show all returned error messages
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDropRejected,
    accept: '.png,.jpg,.jpeg,.gif,.webp',
    maxFiles: 1,
    maxSize: 100000000 // 100 MB
  })

  return (
    <div>
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">IPFS uploader</h1>
          <p className="mb-5 text-base md:mb-6">
            Upload images to IPFS from browser.
          </p>
        </div>
        <div className="flex space-x-4">
          <a
            title="Gateway List"
            href="https://ipfs.github.io/public-gateway-checker"
            target="_blank"
            className="flex items-center"
            rel="noreferrer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="44"
              height="44"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="#ffffff"
              className="w-6 h-6 opacity-70 hover:opacity-100"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <line x1="12" y1="12" x2="12" y2="12.01" />
              <path d="M14.828 9.172a4 4 0 0 1 0 5.656" />
              <path d="M17.657 6.343a8 8 0 0 1 0 11.314" />
              <path d="M9.168 14.828a4 4 0 0 1 0 -5.656" />
              <path d="M6.337 17.657a8 8 0 0 1 0 -11.314" />
            </svg>
          </a>
          <a
            title="Source Code"
            href="https://github.com/sasicodes/ipfs.sasi.codes"
            className="flex items-center"
            target="_blank"
            rel="noreferrer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="44"
              height="44"
              className="w-5 h-5 opacity-70 hover:opacity-100"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="#ffffff"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5" />
            </svg>
          </a>
        </div>
      </div>
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
            <span className="select-all overflow-hidden truncate">
              {ipfsData.hash}
            </span>
            <CopyToClipboard
              text={ipfsData.hash}
              onCopy={() => toast.success('Hash copied 🎉')}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 flex-none cursor-copy opacity-60 hover:opacity-100"
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
              className="hover:text-blue-400 overflow-hidden truncate"
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
                className="w-5 h-5 flex-none cursor-copy opacity-60 hover:opacity-100"
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
