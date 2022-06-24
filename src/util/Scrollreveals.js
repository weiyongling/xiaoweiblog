export default (animateList) => {
    if(!animateList) return;
    let list = animateList;
    list.forEach(item=>{
        item.scrollReveal().reveal(item.el,{
            reset:item.reset,
            mobile: true,
            afterReset:function (el){
                el.classList.remove('animated');
                el.classList.remove(item.animated);
            },
            beforeReveal:function (el){
                el.classList.add('animated');
                el.classList.add(item.animated);
                if(item.duration){
                    el.style['animation-duration'] = item.duration + 's';
                    el.style['-webkit-animation-duration'] = item.duration + 's';
                }
            }
        })
    })
}