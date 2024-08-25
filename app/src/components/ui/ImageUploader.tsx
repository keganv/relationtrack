interface ImageUploaderProps {
  onImagesSelected: (images: File[] | null) => void;
  multiple?: boolean;
  hidden?: boolean;
}
const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImagesSelected,
  multiple = true
}) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      const imageFiles = Array.from(selectedFiles).filter(file =>
        file.type.startsWith('image/')
      );
      return onImagesSelected(imageFiles.length > 0 ? imageFiles : null);
    }
    return onImagesSelected(null);
  };

  return (
    <input type="file" accept="image/*" name="images[]" multiple={multiple}
           onChange={handleFileChange} />
  );
};

export default ImageUploader;
