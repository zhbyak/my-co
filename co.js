// co简易实现
// co函数内部实现一个go方法，专门针对promise，递归调用一个promise对象的then方法。
// 如果promise得到结果，继续调用go(d)方法，把上一步得到的结果传入到generator中，继续调用generator方法的next(data)方法，直到result的值为done为止。
function co(generator){
    var gen = generator();

    var go = function(data){
        var result = gen.next(data);

        if(result.done) return;

        if (result.value instanceof Promise) {
            result.value.then(function (d) {
                go(d);
            }, function (err) {
                go(err);
            })
        }else {
            go();
        }
    };

    go();
}

// Promise demo
// Promise对象new的时候传入一个方法，方法带有2个参数resolve方法和reject方法。
// 传入的匿名方法里面执行异步操作，当操作完成的时候，手动调用resolve(data)方法，有两个作用：
// 1.将这个Promise对象的方法由Pending变成resolved。
// 2.将resoleve(data)中的data作为then方法调用的时候的方法参数传进去。
promise1.then(data=>{console.log(data)});// console: I am text1

var promise1 = new Promise(function(resolve){
        setTimeout(function(){
            resolve("I am text1");
        }, 1000);
});

promise1.then(data=>{alert(data)});

// testDemo
// 使用定义好的co方法逐步执行generator方法中的两个异步yield方法。
co(function*(){
    var text1 = yield new Promise(function(resolve){
        setTimeout(function(){
            resolve("I am text1");
        }, 1000);
    });

    console.log(text1);

    var text2 = yield new Promise(function(resolve){
        setTimeout(function(){
            resolve("I am text2");
        }, 1000);
    });

    console.log(text2);
});

//
