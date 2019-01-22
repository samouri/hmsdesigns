import React, { Component } from 'react';
import './App.css';

import hsMonogram from './hs-monogram.jpg';
import tree from './tree.jpg';

const shirtUrl = `https://spreadsheets.google.com/feeds/cells/1gaxegBkpRpcxcyGcW4NPZWxzBC4h3eqqDc6r3sYdlww/${1}/public/values?alt=json`;

const shirtData = fetch(shirtUrl).then(d => d.json());

function parseSheet(sheetData) {
  const parsedData = [];
  sheetData.feed.entry.forEach(cell => {
    const { row, col, $t: val } = cell[`gs$cell`];
    if (!parsedData[row - 1]) {
      parsedData[row - 1] = []
    }
    parsedData[row - 1][col - 1] = val;
  });

  const headers = parsedData.shift();
  return { headers, rows: parsedData };
}

function Product({ data: [title, price, imageUrl, amznUrl] }) {
  const style = {
    display: 'flex',
    flexDirection: 'column',
    padding: '20px'
  };
  const linkStyle = { textDecoration: 'none', color: 'black' };
  const spanStyle = { textAlign: 'center' };

  return (
    <div style={style}>
      <a href={amznUrl}><img src={imageUrl} width="300px" /></a>
      <span style={spanStyle}>{<a style={linkStyle} href={amznUrl}> {title} </a>} </span>
      <span style={spanStyle}> ${price}</span>
    </div>
  );
}

function ProductGrid({ products }) {
  const style = {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    maxWidth: '1100px'
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', paddingLeft: '44px' }}>
      <div style={style}>
        {products.map((d, i) => <Product data={d} key={i} />)}
      </div>
    </div>
  );
}

class App extends Component {
  state = { products: null };

  componentDidMount() {
    shirtData.then(d => this.setState({ products: parseSheet(d).rows }));
  }

  render() {
    const { products } = this.state;
    const coverImgStyle = {
      height: '300px',
      width: 'calc(100% - 100px)',
      objectFit: 'cover'
    };

    return (
      <div className="App">
        <div style={{ display: 'flex', paddingTop: '20px', paddingLeft: '44px' }}>
          <img src={hsMonogram} height="80px" />
          <h1>HS Designs</h1>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <img style={coverImgStyle} src={tree} />
        </div>

        <div style={{ paddingBottom: '75px' }} />

        {products && <ProductGrid products={products} />}
      </div>
    );
  }
}

export default App;
