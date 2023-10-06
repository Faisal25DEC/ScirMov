const debounce = (func) => {
    let timeoutId;
    //don't care about this 'args' here now
    return (...args) => {
        if(timeoutId){
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(()=>{
            func.apply(null, args);
        },1000)
    }
}