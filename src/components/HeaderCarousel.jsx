import React, {useEffect, useState} from "react";
import banner1 from '/images/banners/1.jpg';
import banner2 from '/images/banners/2.jpg';
import banner3 from '/images/banners/3.jpg';
import banner4 from '/images/banners/4.jpg';

export default function HeaderCarousel() {
const CarouselContent = [{
    id: 1,
    src: banner1,
    alt: "image 1"
  },{
    id: 2,
    src: banner2,
    alt: "image 2"
  },{
    id: 3,
    src: banner3,
    alt: "image 3"
  },{
    id: 4,
    src: banner4,
    alt: "image 4"
  }]

  const [currIndex, setCurrIndex] = useState(0);
  const dots = new Array(CarouselContent.length).fill(10);

  useEffect(() => {
    setTimeout(() => {
      setCurrIndex((currIndex+1)%CarouselContent.length)
      // console.l9*]=-[p0o9iujhgv og(currIndex)
    }, 3000)
    
  }, [currIndex]);


  
  
  return (
    <div transition={{ duration: 2 }} className="rounded-xl transition duration-500 ease-in-out ">
      <img id={CarouselContent[currIndex].id}
        src={CarouselContent[currIndex].src}
        alt={CarouselContent[currIndex].alt}
        className="h-[30vh] lg:h-[92vh] w-full object-contains transition duration-500 ease-in-out grayscale hover:grayscale-0 "
        />

      <div className="flex justify-center mx-auto  border-red-500 relative -top-9">
        {dots.map((curr,index)=>(
          <p className={`w-2 h-2 lg:w-3 lg:h-3 ${index === currIndex ?'bg-white': 'bg-gray-500'} border border-gray-500 rounded-lg mx-3`} key={index}></p>
          ))}
      </div>
          {/* {CarouselContent[currIndex].id} */}
    </div>
  );
}