// generate unique token
function generate_token(AlphaIndex, count) {
    let arr = [];
    for (let a = 0; a < count; a++) {
        batchA = Math.random().toString().slice(2, 6);
        batchB = Math.random().toString().slice(2, 7);
        batchC = Math.random().toString().slice(2, 8);
        arr.push(`${AlphaIndex}${batchA}-${batchB}-${batchC}`);
    }
    return arr
}

console.log(generate_token("A", 100));