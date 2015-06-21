# dashbars

> [Handlebarsjs][]용 헬퍼 라이브러리. [dash.el][], [s.el][], [f.el][], [handlebars-helpers][]을 참고해서 만들었다.

```
{{-take 5 (-drop 3 (-range 0 10))}} // [3,4,5,6,7]
{{-slice 0 5 (-range 0 10)}} // [0,1,2,3,4]

{{#each (-take 5 (-drop 3 (-range 0 10)))}} // [3,4,5,6,7]
    ...
{{else}}
    ...
{{/each}}

{{#if (-lt? 3 myVar)}} // 3 < myVar
    ...
{{else}}
    ...
{{/if}}
```

[Handlebarsjs]: http://handlebarsjs.com/
[dash.el]: https://github.com/magnars/dash.el
[s.el]: https://github.com/magnars/s.el
[f.el]: https://github.com/rejeep/f.el
[handlebars-helpers]: https://github.com/assemble/handlebars-helpers

## Handlebars의 Subexpression

[Handlebarsjs][]는 `{{}}` 와 같은 템플릿을 사용하는데 Subexpression을 지원한다. 아래처럼 생겼다:

```
{{outer-helper (inner-helper 'abc') 'def'}}
```

그러니까 기본 적으로 헬퍼는 `{{operator operand1 operand2 ...}}` 식으로 사용할 수 있고 Subexpresion도 가능해서 `{{operator (operator ...) ...}}`와 같은 형식이 가능하다. 중첩도 돼서 `{{operator (operator (operator ...)) ...}}`와 같은 형식도 가능하다.

이 모습은 lisp이랑 닮았다. 함수를 바로 정의해서 사용할 수 없는 점을 제외하면 lisp이랑 닮았다. lisp의 [dash.el][]같은 라이브러리가 [Handlebarsjs][]에도 필요하다고 생각이 들었다. 그래서 [dashbars][]라는 헬퍼 라이브러리를 만들었다.

## Dashbars

이름은 [dash.el][]에서 따왔고 [dash.el][], [f.el][], [s.el][], [handlebars-helpers][]를 참고해서 만들었다.

되도록 JavaScript의 기본 API를 사용했고 없으면 `lodash`를 사용했다. 이렇게 성능은 브라우저와 lodash에게 묻어 간다. ㅎㅎ

### 함수

[Handlebarsjs][]에서는 함수를 정의할 수 없기 때문에 따로 헬퍼 함수를 정의하고 함수 이름을 사용하도록 했다. 아래와 같이 헬퍼를 정의하면:

```js
Handlebars.registerHelper('-as-is', function(o){
    return o;
});
```

`-map` 헬퍼에 `-as-is`라는 헬퍼를 넘긴다.

```
{{-map '-as-is' (-range 0 5)}} // [0,1,2,3,4]
```

### 좀 더 함수형으로

아규먼트로 받은 리스트나 객체를 그대로 리턴하지 않는다. 리턴하는 객체는 항상 새로운 객체다. `-sort` 헬퍼의 예를 들면 아래처럼 아규먼트로 받은 리스트를 복사해서(slice) 정렬한다(sort).

```js
registerHelpers('-sort', function(list, compare, options) {
    return list.slice().sort(compare);
});
```
Javascript에서 대부분의 Array 함수들은 새로운 Array를 반환하는데 특이하게도 sort는 새 Array를 반환하지 않는다.

### 블럭 헬퍼가 없다.

[dashbars][]에는 블럭 헬퍼가 없다. 이미 [Handlebarsjs][]에 들어 있는 블럭 헬퍼로도 충분하다고 생각한다:

```
{{#each (-take 5 (-drop 3 (-range 0 10)))}} // [3,4,5,6,7]
    ...
{{else}}
    ...
{{/each}}

{{#if (-lt? 3 myVar)}} // 3 < myVar
    ...
{{else}}
    ...
{{/if}}
```

### Predicate

`true/false`를 리턴하는 Predicate 함수의 이름은 `?`으로 끝난다.

### nodejs

`f-`로 시작하는 파일관련 헬퍼는 nodejs에서만 사용할 수 있고 브라우저에서 사용할 수 없다. `path` 모듈에 크게 의존한다.

### ES6

ES6는 아직 고려하지 않았다. 하지만 앞으로 Set, Map, Generator를 지원할 계획이다.

[dashbars]: https://github.com/pismute/dashbars
