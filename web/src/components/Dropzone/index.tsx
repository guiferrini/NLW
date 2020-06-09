import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUpload } from 'react-icons/fi';

import './styles.css';

// tenho q informar ao 'Dropzone' da nova propriedade, e dentro da constante: React.FC<Props>
interface Props {
  onFileUploaded: (file: File) => void;
}

const Dropzone: React.FC<Props> = ({ onFileUploaded }) => {
  const [selectedFileUrl, setSelectedFileUrl] = useState('');

  const onDrop = useCallback(acceptedFiles => {
    const file = acceptedFiles[0];

    const fileUrl = URL.createObjectURL(file);

    setSelectedFileUrl(fileUrl);
    onFileUploaded(file);
  }, [onFileUploaded])

  const {isDragAccept, isDragReject, getRootProps, getInputProps, isDragActive} = useDropzone({
    onDrop,
    accept: 'image/*'
  });
  
  return (
    <div className="dropzone" {...getRootProps()}>
      <input {...getInputProps()} accept='image/*' />

      {/* {isDragAccept && (<p>All files will be accepted</p>)}
      {isDragReject && (<p>Some files will be rejected</p>)}
      {!isDragActive && (<p>Drop some files here ...</p>)} */}

      { selectedFileUrl
        ? <img src={selectedFileUrl} alt="Point image" /> 
        : (
          <p>
            <FiUpload />
            Imagem do Estabelecimento
          </p>
          )
      }
    </div>

  )
}

export default Dropzone;