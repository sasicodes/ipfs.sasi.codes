import { useCallback, useState } from 'react'
import { FileRejection, useDropzone } from 'react-dropzone'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import toast from 'react-hot-toast'
import { getFileType } from './utils'
import GatewayIcon from './icons/GatewayIcon'
import GithubIcon from './icons/GithubIcon'
import CopyIcon from './icons/CopyIcon'
import uploadToIPFS from './upload'

function App() {
  const [uploading, setUploading] = useState(false)
  const [ipfsData, setIpfsData] = useState<{
    hash: string
    url: string
    name: string
    size: string
    type: string
  }>()

  const upload = async (file: File) => {
    try {
      const data = await uploadToIPFS(file)
      setUploading(false)
      setIpfsData(data)
      toast.success('File uploaded 🎉')
    } catch (error) {
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
    maxFiles: 1,
    maxSize: 100000000 // 100 MB
  })

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">IPFS uploader</h1>
          <p className="mb-5 text-base md:mb-6">
            Upload anything to IPFS from browser.
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
            <GatewayIcon />
          </a>
          <a
            title="Source Code"
            href="https://github.com/sasicodes/ipfs.sasi.codes"
            className="flex items-center"
            target="_blank"
            rel="noreferrer"
          >
            <GithubIcon />
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
            <span className="overflow-hidden truncate select-all">
              {ipfsData.hash}
            </span>
            <CopyToClipboard
              text={ipfsData.hash}
              onCopy={() => toast.success('Hash copied 🎉')}
            >
              <CopyIcon />
            </CopyToClipboard>
          </div>
          <div className="flex items-center justify-between mb-10 overflow-hidden truncate">
            <a
              target="_blank"
              className="overflow-hidden truncate hover:text-blue-400"
              href={ipfsData.url}
            >
              {ipfsData.url}
            </a>
            <CopyToClipboard
              text={ipfsData.url}
              onCopy={() => toast.success('URL copied 🎉')}
            >
              <CopyIcon />
            </CopyToClipboard>
          </div>
          <div className="flex items-center overflow-hidden">
            {getFileType(ipfsData.type) === 'image' && (
              <img
                src={ipfsData.url}
                alt="preview"
                className="rounded-xl h-96"
                draggable={false}
              />
            )}
            {getFileType(ipfsData.type) === 'video' && (
              <video className="w-full rounded-xl h-96" controls>
                <source src={ipfsData.url} type="video/mp4" />
                Your browser does not support HTML video.
              </video>
            )}
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default App
