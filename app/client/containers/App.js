import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { selectTile } from '../actions/map';
import { layerAdd, layerRemove, layerClick } from '../actions/layers';
import { tilesetTileAdd, tilesetTileRemove } from '../actions/tileset';
import { tileSetTexture } from '../actions/tiles';
import LayerPane from '../components/LayerPane';
import Inspector from '../components/Inspector';
import Map from '../components/Map';

@connect((state) => state)
export default class App extends Component {
  handleMapClick(e) {
    const { dispatch } = this.props;
    dispatch(selectTile(e.tile));
  }

  handleLayerAdd() {
    const { dispatch } = this.props;
    dispatch(layerAdd());
  }

  handleLayerRemove() {
    const { dispatch } = this.props;
    dispatch(layerRemove());
  }

  handleLayerClick(l, i) {
    const { dispatch } = this.props;
    dispatch(layerClick(l, i));
  }

  handleTextureAddClick() {
    const { dispatch } = this.props;
    dispatch(tilesetTileAdd());
  }

  handleTextureRemoveClick(id) {
    const { dispatch } = this.props;
    dispatch(tilesetTileRemove(id));
  }

  handleTextureSelect(id) {
    const { dispatch, map } = this.props;
    const { selectedTile } = map;
    if (!selectedTile) {
      return;
    }

    const { x, y } = selectedTile;
    dispatch(tileSetTexture(x, y, id));
  }

  render() {
    const { map } = this.props;
    const { width, height, tileWidth, tileHeight,
            selectedTile, layers, selectedLayer, tileset } = map;

    return (
      <div className="window">
        <header className="toolbar toolbar-header">
          <h1 className="title">Cartographer</h1>
          <div className="toolbar-actions">
          </div>
        </header>
        <div className="window-content">
          <div className="pane-group" style={{backgroundColor: '#222222'}}>
            <LayerPane layers={layers.layers} selectedLayer={layers.selectedIndex}
              onLayerAdd={this.handleLayerAdd.bind(this)}
              onLayerRemove={this.handleLayerRemove.bind(this)}
              onLayerClick={this.handleLayerClick.bind(this)}
              />
            <div className="pane" style={{height: '100%'}}>
              <Map
                layers={layers}
                tileset={tileset}
                width={width}
                height={height}
                tileWidth={tileWidth}
                tileHeight={tileHeight}
                selectedTile={selectedTile}
                onClick={this.handleMapClick.bind(this)} />
            </div>
            <Inspector tile={selectedTile} tileset={tileset}
              onTextureAddClick={this.handleTextureAddClick.bind(this)}
              onTextureRemoveClick={this.handleTextureRemoveClick.bind(this)}
              onTileClick={this.handleTextureSelect.bind(this)} />
          </div>
        </div>
      </div>
    );
  }
}
