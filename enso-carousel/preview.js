(() => {
'use strict';
const cards = [
{title:'指輪づくりのあとに、この日だけのディナーを。',caption:'指輪づくりのあとに、この日だけのディナーを。鎌倉本店とenso hanareで、ふたりの記憶になる一日を。2027年1月11日〜3月30日の月・火曜日限定開催です。'},
{title:'ふたりで過ごす、鎌倉の一日',caption:'鎌倉本店で指輪を手作りしたら、街を散策してenso hanareへ。指輪づくりの余韻とともに、ふたりで過ごす鎌倉の一日をお楽しみください。'},
{title:'この日のために仕立てた、特別なディナーコース',caption:'OSAJIが手がける鎌倉・佐助のレストランenso hanare。通常の夜はアラカルトで楽しむお店が、この企画のために特別なディナーコースをご用意します。'},
{title:'料金のご案内',caption:'指輪制作は1本98,000円〜、ディナーはお一人8,800円（税込）。指輪のデザイン・幅・素材により料金が異なり、別途石代・加工費がかかる場合があります。'},
{title:'ふたりの記憶になる、鎌倉の一日を。',caption:'2027年1月11日〜3月30日、月・火曜日限定。鎌倉本店での指輪づくりと、enso hanareでのディナーを楽しむ各日3組限定の企画です。開催日・プランの詳細は「詳しくはこちら」から。'}
];
const only=new URLSearchParams(location.search).get('ratio');
if(['portrait','square'].includes(only))document.body.dataset.only=only;
const posts=[...document.querySelectorAll('.ad-shell')];
const tracks=posts.map(post=>post.querySelector('.artwork-track'));
const previous=document.querySelector('#previous'),next=document.querySelector('#next');
let current=0,programmaticUntil=0;
const pad=n=>String(n).padStart(2,'0');
function update(index){
current=index;
document.querySelector('#slide-number').textContent=pad(index+1);
document.querySelector('#slide-total').textContent=pad(cards.length);
previous.disabled=index===0;next.disabled=index===cards.length-1;
posts.forEach(post=>{
post.querySelector('.caption-copy').textContent=cards[index].caption;
post.querySelector('.picture-previous').hidden=index===0;
post.querySelector('.picture-next').hidden=index===cards.length-1;
post.querySelectorAll('.native-dots button').forEach((dot,i)=>dot.setAttribute('aria-current',String(i===index)));
});
}
function go(index,{origin=null,instant=false}={}){
index=Math.max(0,Math.min(cards.length-1,index));
update(index);
programmaticUntil=performance.now()+650;
const behavior=instant||matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth';
tracks.forEach(track=>{if(track!==origin)track.scrollTo({left:track.clientWidth*index,behavior});});
}
posts.forEach((post,p)=>{
const track=tracks[p],ratio=post.dataset.ratio;
cards.forEach((card,i)=>{
const figure=document.createElement('figure');figure.className='artwork';figure.setAttribute('role','group');figure.setAttribute('aria-label',(i+1)+' / '+cards.length);
const image=document.createElement('img');image.src='assets/'+ratio+'-'+pad(i+1)+'.png';image.alt=card.title;image.width=1080;image.height=ratio==='portrait'?1350:1080;image.draggable=false;figure.append(image);track.append(figure);
const dot=document.createElement('button');dot.type='button';dot.setAttribute('aria-label',(i+1)+'枚目へ');dot.addEventListener('click',()=>go(i));post.querySelector('.native-dots').append(dot);
});
post.querySelector('.picture-next').addEventListener('click',()=>go(current+1));
post.querySelector('.picture-previous').addEventListener('click',()=>go(current-1));
let timer=0,start=null,dragged=false;
const settled=()=>{if(performance.now()<programmaticUntil){clearTimeout(timer);timer=setTimeout(settled,180);return;}const index=Math.max(0,Math.min(cards.length-1,Math.round(track.scrollLeft/track.clientWidth)));if(index!==current)go(index,{origin:track,instant:true});};
track.addEventListener('scroll',()=>{clearTimeout(timer);timer=setTimeout(settled,170);},{passive:true});
track.addEventListener('pointerdown',event=>{if(event.pointerType!=='mouse'||event.button!==0)return;start={x:event.clientX,scroll:track.scrollLeft,id:event.pointerId,index:current};dragged=false;track.setPointerCapture(event.pointerId);});
track.addEventListener('pointermove',event=>{if(!start)return;const dx=event.clientX-start.x;if(Math.abs(dx)>5){dragged=true;track.classList.add('dragging');track.scrollLeft=start.scroll-dx;event.preventDefault();}});
const end=event=>{if(!start)return;const dx=event.clientX-start.x;const index=Math.abs(dx)>35?start.index+(dx<0?1:-1):start.index;start=null;track.classList.remove('dragging');if(dragged)go(index);};
track.addEventListener('pointerup',end);track.addEventListener('pointercancel',()=>{start=null;track.classList.remove('dragging');go(current,{instant:true});});
});
previous.addEventListener('click',()=>go(current-1));next.addEventListener('click',()=>go(current+1));
document.addEventListener('keydown',event=>{if(event.key==='ArrowRight'){event.preventDefault();go(current+1);}if(event.key==='ArrowLeft'){event.preventDefault();go(current-1);}});
let resizeTimer;addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>go(current,{instant:true}),100);});
update(0);
})();
