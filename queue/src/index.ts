import { parseFromString } from 'dom-parser';

const html = await fetch('http://localhost:8191/v1', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    cmd: 'request.get',
    url: 'https://www.thalia.de/shop/home/artikeldetails/A1069506874',
    session: 'e31c751c-9204-11ef-8577-0242ac120002',
    maxTimeout: 60000
  })
})
  .then((b) => b.json())
  .then((r) => r.solution.response);

const doc3 = parseFromString(html);
const obj = Object.fromEntries(
  [...doc3.getElementsByTagName('meta')].map((e) => [
    e.getAttribute('name') || e.getAttribute('property'),
    e.getAttribute('content')
  ])
);

const { title, author, type, isbn } =
  /^'(?<title>[\w ]*)' von '(?<author>[\w ]*)' - '(?<type>[\w ]*)' - '(?<isbn>.*)'$/.exec(
    obj['og:title']
  )!!.groups!!;

const price = parseFloat(obj['product:price:amount']);
const image = obj['og:image'];

console.log(obj, { title, author, type, isbn, price, image });
