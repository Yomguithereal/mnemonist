# Notes

## Miscellaneous

* minimize lookup (get/has)
* simulate pointers in flat byte arrays
* avoid creating objects
* Is it worth it on JIT? Hard to optimize
* Against clichés sur le frontend
* Object vs. Map
* Cost of function calls
* LRUCache
* WebAssembly?
* Inspect, iterators, convenient functions (avec l’ES6 c’est plus simple de faire consistent * => pointer la fonction d’itération d’obliterator vs python
* comment faire un #.clear efficace (attention sécu!, comme les Buffer)
* au final beaucoup de choses qui s’appliquent à d’autres langages
* merger des listes ordonnées
* le quadtree de sigma
* ne pas créer des fonctions dans des fonctions
* optimization tricks
* byte array the poor’s man malloc
* can’t beat hash maps tree useless
* pretend the language has static types
* asmjs
* exemple graphology not reuse other methods sometime to avoid calls and redoing some type validation (js staïle)
* si on peut tout faire en C++ ou asm sans sortir alors why not
* frontière indépassable: la hashmap
* distinguer les byte arrays pour bénéficier du typage, réduire les ops arithmétiques ou * utiliser view on array buffer
* bitwise magic
* consistency of the API

---

* Why? Convenience data structure such as graph (to avoid bookkeeping) or fuzzy map.
* In real life sometimes n is better than log n (number of operations to take into account)
* Fixed size arrays vs. python
* Stacks vs. recursion (tree or no tree)
* Nested functions and nested inline regexes (example nested foreach) => more general optimization tip
* We process data client side and to do that efficiently we need structures. (What's more, a the user won't want to wait so much. example clustering)
* Unsafe iterator as an example of costly object creation
* Why bother since objects and arrays are all we need? Will always be faster through native optims
* You have to pretend very hard:
  1. That the language is typed
  2. That the language has no dynamic length structures
* An example of why: the quadtree (sigma)
* Efficient inverted index

## Plan

1. clichés
2. why
3. quelques use cases
4. challenges
5. tip & tricks avec le use case à chaque fois
6. point final du talk: relativiser le JIT etc. parce que en fait c’est applicable avec la plupart des langages (a part le malloc du pauvre qui marche pas en python, encore moins en numpy) => Math.min conundrum
7. Examples where taken from those libs
