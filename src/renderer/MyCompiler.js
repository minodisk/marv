import React from 'react'
// import Compiler from 'imports?React=react!md2react'
import Compiler from 'imports?React=react!../../node_modules/md2react/src/index'
import path from 'path'

let $ = React.createElement;

export default class MyCompiler extends Compiler {
  compile(md, dir) {
    this.dir = dir;
    this.ids = {};
    return super.compile(md);
  }

  root(node, defs, key, tableAlign) {
    return $('div', {
      key,
      className: 'markdown-body'
    }, this.toChildren(node, defs, key));
  }

  image({src, title, alt}, defs, key, tableAlign) {
    if(!(/^https?:\/\//.test(src))) {
      src = path.resolve(this.dir, src);
    }
    return $('img', {
      key,
      src: src,
      title: title,
      alt: alt
    });
  }

  heading(node, defs, key, tableAlign) {
    let text = node.children
      .filter((child) => { return child.type == 'text' })
      .map((child) => { return child.value })
      .join('');
    let id = text
      .toLowerCase()
      .replace(/\s/g, '-')
      .replace(/[!<>#%@&='"`:;,\.\*\+\(\)\{\}\[\]\\\/\|\?\^\$]+/g, '')
    if (this.ids[id] == null) {
      this.ids[id] = 0;
    } else {
      this.ids[id]++;
      id = `${id}-${this.ids[id]}`
    }
    return $(('h'+node.depth.toString()), {key}, [
      $('a', {key: key+'-a', id: id, className: 'anchor', href: '#'+id}, [
        $('span', {key: key+'-a-span', className: 'icon icon-link'})
      ]),
      this.toChildren(node, defs, key)
    ]);
  }
}
