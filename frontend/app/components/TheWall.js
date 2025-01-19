import Layout from './Layout';
import styles from '../styles/TheWall.module.css';
import Image from 'next/image';
import { useState } from 'react';

const gifLists = [
  [
    "https://i.giphy.com/V2ojLo7PvhVug.webp",
    "https://media4.giphy.com/media/W9lzJDwciz6bS/giphy.webp",
    "https://media0.giphy.com/media/mSXSC0vivvygw/100.webp",
    "https://i.giphy.com/saD01LsKDzxL2.webp",
    "https://media1.giphy.com/media/v7WM6sLcnGIc8/giphy.webp",
    "https://i.giphy.com/3o7btNhMBytxAM6YBa.webp",
    "https://media4.giphy.com/media/rxVSSIKyu3BTPPSW1G/200.webp",
    "https://media2.giphy.com/media/6xE1FNcorRInS/200.webp",
    "https://media3.giphy.com/media/1eEv7v51FEI3L54jpr/200.webp",
    "https://media1.giphy.com/media/nGnKGLOqzhfGM/100.webp",
    "https://media3.giphy.com/media/JzzLFXnZt4aiI/100.webp",
    "https://i.giphy.com/fS9PCxQYG0ULu.webp",
    "https://i.giphy.com/MC6eSuC3yypCU.webp",
    "https://i.giphy.com/uvoECTG2uCTrG.webp",
    "https://i.giphy.com/8rSiGkyA4P1Cw.webp",
    "https://i.giphy.com/QJE93F8fx3Bzjc62zJ.webp"
  ],
  // [
  //   "https://media1.giphy.com/media/l0Exk8EUzSLsrErEQ/giphy.webp",  // Doge "Wow"
  //   "https://media1.giphy.com/media/VbnUQpnihPSIgIXuZv/giphy.webp",  // Rickroll
  //   "https://media3.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.webp",  // Shrek Dance
  //   "https://media0.giphy.com/media/mlvseq9yvZhba/giphy.webp",      // Grumpy Cat
  //   "https://media4.giphy.com/media/l3q2wJsC23ikXCoBG/giphy.webp"   // Pepe Frog
  // ],
  // [
  //   "https://media0.giphy.com/media/l41lFw057lAJQMwg0/giphy.webp",  // Michael Scott
  //   "https://media3.giphy.com/media/VbnUQpnihPSIgIXuZv/giphy.webp",  // Distracted Boyfriend
  //   "https://media2.giphy.com/media/3oriO0OEd9QIDdllqo/giphy.webp",  // This is Fine
  //   "https://media4.giphy.com/media/3o6Zt481isNVuQI1l6/giphy.webp",  // Overly Attached Girlfriend
  //   "https://media1.giphy.com/media/5xaOcLOqNm1D3MuXwM4/giphy.webp"  // Arthur Fist
  // ],
  // [
  //   "https://media0.giphy.com/media/3o7btO8E4s5NXUvXo0/giphy.webp",  // 404 Socks
  //   "https://media1.giphy.com/media/3oz8xVPWvHpudHhJYw/giphy.webp",  // CSS Fail
  //   "https://media3.giphy.com/media/l2JehQ2GitHGdVG9y/giphy.webp",  // Stack Overflow
  //   "https://media2.giphy.com/media/l0HlNQ03J5JxX6lva/giphy.webp",  // Git Conflict Mug
  //   "https://media0.giphy.com/media/3o7aD2saalBwwftBIY/giphy.webp"   // Keyboard Cat
  // ]
];

const TheWall = () => {
  const randomList = gifLists[Math.floor(Math.random() * gifLists.length)];
  const [selectedGif, setSelectedGif] = useState(
    randomList[Math.floor(Math.random() * randomList.length)]
  );

  const handleGifClick = (gif) => {
    setSelectedGif(selectedGif === gif ? null : gif);
  };

  const repeatedGifs = Array(100).fill(randomList).flat();

  return (
    <Layout>
      <div className={`${styles.container} fixed inset-0 w-full h-full overflow-hidden`}>
        {selectedGif ? (
          <div className="fixed inset-0 flex items-center justify-center">
            <Image 
              src={selectedGif} 
              alt="Selected gif" 
              layout="fill" 
              objectFit="cover" 
              onClick={() => handleGifClick(selectedGif)}
            />
          </div>
        ) : (
          <div className="grid grid-cols-7 grid-rows-6 gap-0 w-full h-full">
            {repeatedGifs.map((gif, index) => (
              <div key={index} className="relative w-full h-full cursor-pointer" onClick={() => handleGifClick(gif)}>
                <Image 
                  src={gif} 
                  alt="gif tile" 
                  layout="fill" 
                  objectFit="cover" 
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default TheWall;
