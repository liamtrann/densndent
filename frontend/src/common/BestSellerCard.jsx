import React from "react";
import { Image } from '../common';

export default function BestSellerCard(props) {
  const base_file_url = "https://4571901-sb1.app.netsuite.com"
  console.log(props)
  return (
    <div className="shadow-md rounded-lg p-3 bg-white">
      <Image src={props.file_url?`${base_file_url}${props.file_url}`: null} className="mx-auto h-24 object-contain mb-2" />
      {/* <p className="text-xs text-gray-600">{props.brand}</p> */}
      <h3 className="font-bold text-sm">{props.itemid}</h3>
    </div>
  );
}
