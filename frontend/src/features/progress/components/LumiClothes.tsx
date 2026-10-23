import type { LumiStyle } from '../../auth/context/AuthContext';
export const defaultStyle:LumiStyle={outfit:'none',hair:'none',hat:'none'};
export function LumiClothes({style,layer}:{style:LumiStyle;layer:'back'|'front'}) {
  if(layer==='back')return style.outfit==='cape'?<path d="M89 110Q63 139 70 168L119 152 170 168Q178 140 151 110" fill="#9470cf" stroke="#604297" strokeWidth="2"/>:null;
  return <g data-lumi-outfit={style.outfit} data-lumi-hair={style.hair} data-lumi-hat={style.hat}>
    {style.outfit==='sweater'&&<g><path d="m87 126 32 7 34-7 4 27q1 8-8 6l-29-14-29 14q-11 5-10-6z" fill="#e58091" stroke="#a64d69" strokeWidth="2"/><path d="m92 139 14 4m28 0 14-4" stroke="#ffc7cd" strokeWidth="3"/><path d="m120 133-4 7 4 5 4-5z" fill="#ffe4a1"/></g>}
    {style.outfit==='overalls'&&<g fill="#579cb9" stroke="#286583" strokeWidth="2"><path d="M88 125h64l5 28q1 9-8 6l-29-14-29 14q-11 5-10-6z"/><path d="M91 122v20m58-20v20" stroke="#d5eff0" strokeWidth="5"/><path d="M109 134h22v10h-22z"/><circle cx="92" cy="139" r="2" fill="#ffdb80"/><circle cx="148" cy="139" r="2" fill="#ffdb80"/></g>}
    {style.outfit==='cape'&&<g><path d="m88 127 32 8 32-8" stroke="#ac89e7" strokeWidth="7" fill="none"/><circle cx="120" cy="135" r="4" fill="#ffe4a1"/></g>}
    {style.hair==='curls'&&<g fill="#684330" stroke="#432d29" strokeWidth="1.5">{[82,94,106,118,130,142,154].map((x,i)=><circle key={x} cx={x} cy={86-Math.sin(i/6*Math.PI)*17} r="10"/>)}<circle cx="81" cy="100" r="9"/><circle cx="157" cy="100" r="9"/></g>}
    {(style.hair==='pink'||style.hair==='silver')&&<g fill={style.hair==='pink'?'#ec9cc2':'#d2e0f2'} stroke={style.hair==='pink'?'#aa5885':'#879ebd'} strokeWidth="2"><path d="M80 102Q76 68 119 64q45 0 43 40l-13-12q-14 1-27-14-18 20-33 15l-2 19z"/><path d="M82 92q-11 17-5 33l12-9m67-24q11 17 5 33l-12-9"/></g>}
    {style.hat==='beanie'&&<g><path d="M85 80q0-33 35-33t35 33" fill="#54a7a9" stroke="#297c86" strokeWidth="2"/><rect x="83" y="76" width="74" height="13" rx="6" fill="#92d5ca"/><circle cx="120" cy="44" r="9" fill="#bde8dc"/><path d="M111 79h18v8h-18z" fill="#ffe7a4"/></g>}
    {style.hat==='party'&&<g><path d="m91 79 26-51 28 51z" fill="#e5a0c8" stroke="#a25c8c" strokeWidth="2"/><path d="m104 55 25 12m-32 1 39 9" stroke="#ffe7a4" strokeWidth="5"/><circle cx="117" cy="26" r="6" fill="#ffe7a4"/></g>}
    {style.hat==='crown'&&<g><path d="m86 56 17 12 17-23 17 23 17-12-5 29H91z" fill="#ffe18a" stroke="#b98b38" strokeWidth="2"/><circle cx="120" cy="73" r="4" fill="#e39ba7"/><path d="M94 81h52" stroke="#fff0bc" strokeWidth="3"/></g>}
  </g>;
}
