Apply
=====

Devlopment version
[http://leonardosalles.com/apply/](http://leonardosalles.com/apply/ "Devlopment version")

Production version
[http://leonardosalles.com/apply/dist/](http://leonardosalles.com/apply/dist/ "Production version")


Project Documentation


>######static/js/services/artworks.js
  method: findAll<br />
  in: Callback as a Function that receives the list of Artworks<br />
  out: Returns the list of Artworks and invoke a callback passing returned list<br />
  
>  method: findById <br />
  in: Artwork ID <br />
  out: Returns a single Artwork using  the Id parameter<br />
  
>  method: getMediums<br />
  in: Callback as a Function that receives the list of Mediums<br />
  out: See resourceAsList method<br />
  <br />
>  method: getMaterials<br />
  in: Callback as a Function that receives the list of Materials<br />
  out: See resourceAsList method<br />

>  method: resourceAsList<br />
  in: Callback as a Function that receives the list of resource and the resource like Mediums or Materials<br />
  out: Return a list of received resource<br />
  <br />
>######static/js/services/utils.js<br />
  method: findByUrlInArray<br />
  in: A key to compare and an Array to search this key<br />
  out: Returns the object that contains passed key<br />
  <br />
  method: getElementDataId<br />
  in: The element as parameter to avoid DOM selection<br />
  out: Returns the position index of an item in Artworks array<br />
<br />
static/js/translates/locale_en.js<br />
  description: File that contains strings of i18n internationalization<br />
  
>######static/js/filters/artist.js<br />
  description: Used to filter Artworks by artists<br />
  <br />
static/js/directives/header.js<br />
  description: A component that provide a header template with filter field<br />
  
>######static/css/app.less<br />
  description: The file of developed css for this app<br />
  

