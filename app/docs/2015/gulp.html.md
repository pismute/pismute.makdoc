# Gulp 소개

> Gulp 프로젝트 자체는 소스도 길지 않고 별거 없다. Vinyl이라는 가상 파일 시스템과 Orchestrator라는 타스크 엔진을 너무나도 잘 섞어 놓은 타스크 러너다.

Grunt에서 처음 넘어왔을 때는 너무 어색했다. 소스를 까봤을 때의 충격이란...

![](./gulp.png)

(from http://jhalaldrut.blogspot.kr/2012/09/gulp.html)

Gulp 자체는 별거 없고 여러 프로젝트로 자잘하게 쪼개져 있다. 그래서 원하는 기능이 구현된 소스를 찾는 일은 술래잡기의 재미(?)와 메멘토적 경험(?)을 선사해 준다.

주관적인 견해로 Grunt보다 나은 점은 아래와 같다:

- 빠르다: 매개체로 파일이 아니라 메모리를 사용한다.
- 항상 비동기다: 동기를 선택할 수 없어서 더 단순한 것 같다.
- 코드가 짧다.

사실 굳이 Gulp를 사용할 필요가 없다. 응!?

Gulp의 뼈대는 비동기 타스크와 스트림이다.

## 타스크

비동기라는 점을 제외하면 Ant나 Make 같은 타스크 러너와 다를 게 없어 이해하기 쉽다.

타스크는 아래와 같이 정의한다:

```js
gulp.task('myTask', function(){
    // do anything.
});
```

타스크를 만들고 달성해야 할 것을 달성하면 된다. 하지만, 이 타스크는 틀렸다. Gulp는 비동기라서 타스크가 끝났음을 반드시 Gulp에게 알려줘야 한다.

타스크 하나씩 테스트할 때는 잘 동작하기 때문에 빠트리기 쉽다. 끝남을 알려주지 않으면 다음 타스크를 실행하지 않고 그냥 멈춰버린다. Gulp는 타스크가 실행 중이라고 생각해서 다음 타스크로 연결하지 않는다.

타스크가 끝났음을 알리는 방법은 세 가지다. 아래 예제는 gulp 문서에서 가져왔다:

#### Callback

```js
// run a command in a shell
var exec = require('child_process').exec;
gulp.task('jekyll', function(cb) {
  // build Jekyll
  exec('jekyll build', function(err) {
    if (err) return cb(err); // return error
    cb(); // finished task
  });
});
```

#### Return a stream

```js
gulp.task('somename', function() {
    var stream = gulp.src('client/**/*.js')
        .pipe(minify())
        .pipe(gulp.dest('build'));
    return stream;
});
```

#### Return a promise

```js
var Q = require('q');

gulp.task('somename', function() {
    var deferred = Q.defer();

    // do async stuff
    setTimeout(function() {
        deferred.resolve();
    }, 1);

    return deferred.promise;
});
```

나는 보통은 Callback이 간단해서 더 좋다.

### Orchestrator 타스크 러너

타스크 실행과 관리는 Orchestrator 프로젝트에 의존하는데 아 몰랑 넘어갈래.

## 스트림

스트림은 Blob 패턴에 따라 스캔한 Vinyl 파일을 Transformer로 한 단계 한 단계씩 처리하는 스트림이다. 유닉스 파이프와 유사하다. 유닉스 파이프로 표현하자면 `gulp.src('path/to/**.js') | Transformer1 | Transformer2 | ...' 이렇게 표현할 수 있다.

그리고 Gulp 플러그인은 이 Transformer다. Grunt에서는 플러그인이 타스크였기 때문에 처음에는 조금 헷갈렸다. 물론 플러그인에 타스크를 정의하고 여러 프로젝트에서 타스크를 공유하는 꼼수를 찾아냈다. 이 글의 범위와 벗어나는데다 꼼수이므로 소개하지 않겠다.

Vinyl 파일부터 Gulp 플러그인을 정의하는 것까지 달성해보자.

### Vinyl 파일

Vinyl 파일은 가상 파일로 일종의 컨테이너다. 세 가지 중 하나를 포함한다.

- Empty: 아무것도 포함하지 않음.
- Stream: 스트림
- Buffer: 메모리 버퍼

Gulp는 이 Vinyl파일을 Transform하는 Transformer를 죽죽 연결하는 방식으로 사용한다:

```js
gulp.task('mytask', function(){
    return gulp.src('path/to/**.js')
        .pipe($.using())
        .pipe(through.obj(function(file, enc, done){
            //file이 Vinyl 파일이다.
        }))
        .pipe(gulp.dest(makdoc.vars.DIST()))
        .pipe($.size());
});
```

`gulp.src()`에서 만들어진 Vinyl 파일을 하나씩 처리한다.

### Gulp 플러그인

플러그인은 아래와 같이 만들고 사용한다:

```js
// 만들기
var through = require('through2'); //이하 생략

var myPlugin = function(){
    return through.obj(function(file, enc, done){
        //my plugin
    })
}

// 사용하기
    .pipe(myPlugin())
```

실제 플러그인은 아래처럼 만든다:

```js
var plugin = function() {
    return through.obj(function(file, enc, done){
        if (file.isNull()) {
            return done(null, file);
        }

        if (file.isStream()) {
            this.emit('error', new gulpUtil.PluginError(_PLUGIN_NAME,
                'Streaming not supported'));
            return done();
        }

        // transform file.

        done(null, file);
    });
};
```

## 테스트

사실 아직 테스트를 잘 작성하지 않아서 연구를 많이 못 했다. 하지만, 고민하던 것을 정리해본다.

먼저 리팩토링해서 Side-effect가 없는 코드를 함수로 분리해서 Mocking 없이 테스트할 수 있게 한다. Gulp는 타스크 러너고 알고리즘이나 이런 거 짤 일은 없다. Side-effect가 많으면 Mocking이 필요하고 시간이 많이 든다. Side-effect가 없는 코드를 별도 함수로 분리해서 쉽게 테스트를 할 수 있기 쉽게 하고 어려운 것은 틈틈이 하는 게 좋겠다. 어려워도 바라면 길은 있다. 우주가 돕는다.

Gulp에서 직접 작성하는 코드는 크게 타스크와 플러그인으로 나눌 수 있다. 각각 다른 트릭이 필요할 텐데 아직은 잘 모른다.

### 타스크 테스트

타스크를 테스트하는 방법은 아직 모른다. 테스트를 짠 적 없다. 함수로 분리해서 테스트해도 돼서 우회 책도 있다. 그래도 굳이 해야 한다면 현재는 아래처럼 하겠다.

```js
var myTask = function(done){
    done();
}

gulp.task('myTask', myTask);

export.exports = {
    myTask: myTask
}
```

이렇게 작성하고 myTask 함수를 테스트한다. Gulp에 타스크 함수를 가져오는 API가 있을 것도 같지만, 아직 찾아보지 않았다.

### 플러그인 테스트

플러그인을 테스트하는 방법은 Gulp에서 매우 잘 설명한다.

- https://github.com/gulpjs/gulp/blob/master/docs/writing-a-plugin/testing.md

테스트는 언젠가 별도로 정리해야겠다.

## 플러그인 소개

유용한 플러그인을 몇 개 소개한다.

이 플러그인들을 적용한 코드는 https://github.com/pismute/gulp-makdoc/blob/master/lib/tasks.js 에 있다.

#### [gulp-load-plugin][]

플러그인을 하나하나 require로 로딩하지 않아도 되기 때문에 편리하다.

어떤 것을 로딩할지는 `package.json`의 의존성을 보고 결정한다. 예를 들어 `gulp-using` 플러그인이 `package.json`에 정의돼 있으면 `$.using()`을 사용할 수 있다.

```js
var $ = require('./gulp-load-plugins')

gulp.task('mytask', function(){
    return gulp.src('path/to/**.js')
        .pipe(through.obj(function(file, enc, done){
            //file이 Vinyl 파일이다.
        }))
        .pipe(gulp.dest('path/to/scripts'))
});
```

#### [run-sequence][]

타스크를 차례대로 실행하거나 병렬로 실행할 수 있다. Gulp에는 타스크를 줄 세우는 기능이 약하기 때문에 유용하다.

```js
var seq = require('run-sequence');
gulp.task('myTask', function(done){
    seq('init',
        ['clean', 'clear'], //parallels
        done);
});
```

이 예제는 아래와 같다:

1. init 타스크를 실행
2. clean, clear를 병렬로 실행.
3. done을 호출해서 myTask를 끝냄.

#### [gulp-cached][]

watch 타스크를 사용할 때 필수다. 처리한 파일을 메모리에 저장해뒀다가, 다음에 다시 시도하면 변경한 파일만 통과시킨다.

```js
gulp.task('myTask', function(done){
    return gulp.src('path/to/**')
        .pipe($.cached('myTask')) //cache 이름
        .pipe($.using()) //변경한 파일만 출력된다.
});

gulp.task('watch', function(done){
    //파일이 하나만 변경돼도 myTask를 통째로 실행
    gulp.watch('path/to/**', ['myTask']);

    done();
});

gulp.task('default', function(done){
    seq('myTask', 'watch', done);
});
```

이렇게 정의하고 실행하면 'myTask', 'watch' 순으로 실행한다. 'myTask'를 실행할 때 `$.cached()`를 통과하는 파일은 모두 캐시한다.

그러고 나서 Gulp가 watch하고 있는 파일 중 하나가 실행하면 'myTask'가 다시 실행된다.

'myTask' 타스크는 변경된 파일에 대해서만 선택적으로 처리하는 것이 아니라 'path/to/**'로 스캔하는 파일을 전부 다시 처리한다.

그래서 `$.cached()` 플러그인으로 변경된 파일만 처리하도록 필터링하는 것이 필요하다.

#### [gulp-connect][]

Livereload를 위해서 필요하다:

```js
gulp.task('server', function(done){
    $.connect.server({
        livereload: true,
        root: ['path/to/root'],
        port: 9000
    });

    done();
});
```

이렇게 서버를 띄우고 Livereload를 할 타스크에 플러그인을 추가한다:

```js
        .pipe(gulp.dest('scripts/'))
        .pipe($.connect.reload());
```

이 플러그인은 `watch` 타스크를 함께 쓸 때 빛난다. 어떤 파일이 변경되면 `gulp-cached` 플러그인으로 그 파일만 선택해서 `gulp-connect` 플러그인으로 Reload 시킨다.

#### [gulp-filter][]

이 플러그인은 if 문이라고 생각하면 쉽다. 말로 설명하면 에너지가 분산되니 바로 소스를 보자.

```js
gulp.task('styles', function() {
    var lessFilter = $.filter('**/*.less');
    var scssFilter = $.filter('**/*.scss');

    return gulp.src('path/to/**/*.{css,less,scss}')
        .pipe($.cached('styles'))
        .pipe($.using())
        .pipe(lessFilter)
        .pipe($.less({
            strictMath: true,
            strictUnits: true
        }))
        .pipe(lessFilter.restore())
        .pipe(scssFilter)
        .pipe($.sass({ style: 'expanded' }))
        .pipe(scssFilter.restore())
        .pipe($.autoprefixer('last 2 version'))
        .pipe($.minifycss())
        .pipe($.rename({ suffix: '.min' }))
        .pipe(gulp.dest('path/to/styles/'))
        .pipe($.connect.reload());
});

```

scss 파일을 컴파일하는 것과 less 파일을 컴파일하는 것은 `gulp-filter` 플러그인을 이용해서 각각 하고 컴파일한 css 파일은 공통으로 처리한다.

#### [gulp-cache][]

`gulp-cache`는 `gulp-cached`와 다른 플러그인이다. `gulp-cache`는 오래 걸리는 작업은 처음에 캐시하고 재사용하는 데 사용한다.

이미지를 압축하는 일은 한번 압축하면 다시 압축할 필요가 없다. 개발할 때 엄청 여러 번 gulp를 실행한다. 오래 걸리는 이미지 압축은 변경될 때 한 번만 실행하면 좋을 것이다. 한번 압축한 것을 저장해 뒀다가 재사용하면 매번 시간을 줄일 수 있다.

이미지 최적화는 `gulp-imagemin`을 사용한다:

```js
gulp.task('images', function () {
    return gulp.src('path/to/image')
        .pipe($.cached('images'))
        .pipe($.using())
        .pipe($.cache($.imagemin({
            optimizationLevel: 3,
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest('path/to/image'))
        .pipe($.size())
        .pipe($.connect.reload());
});
```

## 참고

- https://github.com/gulpjs/gulp/blob/master/docs/API.md
- 각 플러그인 문서.

[gulp-load-plugin]: https://github.com/jackfranklin/gulp-load-plugins
[run-sequence]: https://github.com/OverZealous/run-sequence
[gulp-cached]: https://github.com/wearefractal/gulp-cached
[gulp-connect]: https://github.com/AveVlad/gulp-connect
[gulp-cache]: https://github.com/jgable/gulp-cache
[gulp-filter]: https://github.com/sindresorhus/gulp-filter
