import { File, NFTStorage } from '../assets/js/nft-storage.esm.min';

// export const uploadMediaToIPFS = (media) => {
//   return new Promise(async (resolve, reject) => {
//     const name = `${+new Date()}.jpg`;
//     const image = dataURLtoFile(media, name);
//     const nftStorage = new NFTStorage({ token: process.env.NFT_STORAGE_KEY });
//     const token = await nftStorage.store({
//       image,
//       name,
//       description: `Web3 Community ${name}`,
//     });
//
//     if (token.url) {
//       resolve(token.data.image.pathname.replace('//', ''));
//     }
//     reject("Error: IPFS Upload failed");
//   })
// }

export const uploadNFTtoIPFS = (formData) => {
  return new Promise(async (resolve, reject) => {
    let nftMetadata = {
      image: formData.media,
      name: formData.name,
      description: formData.description
    };

    if (formData.attributes.length) {
      nftMetadata.attributes = [];
      formData.attributes.map(attr => {
        if (attr.type.length && attr.value.length) {
          nftMetadata.attributes.push({
            "trait_type": attr.type,
            "value": attr.value
          })
        }
      })
    }

    const client = new NFTStorage({ token: process.env.NFT_STORAGE_KEY });
    const metadata = await client.store(nftMetadata);
    if (metadata.url) {
      resolve(metadata);
    }
    reject("Error: IPFS Upload failed");
  })
}

export function dataURLtoFile(dataUrl, fileName) {
  const arr = dataUrl.split(',');
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  let u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], fileName, {
    type: mime,
    lastModified: new Date().getTime()
  });
}

export const resizeFileImage = (file, max_width, max_height) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function (e) {
      const img = document.createElement("img");
      img.src = e.target.result;

      setTimeout(() => {
        const canvas = document.createElement("canvas");
        let ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > max_width) {
            height *= max_width / width;
            width = max_width;
          }
        } else {
          if (height > max_height) {
            width *= max_height / height;
            height = max_height;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(result => {
          if (result) {
            resolve(result);
          } else {
            reject("Can't read image")
          }
        }, file.type);
      }, 300);
    };
    reader.readAsDataURL(file);
  });
}
