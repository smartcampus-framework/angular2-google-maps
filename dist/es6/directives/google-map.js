/**
 * angular2-google-maps - Angular 2 components for Google Maps
 * @version v0.9.0
 * @link https://github.com/SebastianM/angular2-google-maps#readme
 * @license MIT
 */
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, ElementRef, EventEmitter } from 'angular2/core';
import { GoogleMapsAPIWrapper } from '../services/google-maps-api-wrapper';
import { MarkerManager } from '../services/marker-manager';
import { InfoWindowManager } from '../services/info-window-manager';
/**
 * SebMGoogleMap renders a Google Map.
 * **Important note**: To be able see a map in the browser, you have to define a height for the CSS
 * class `sebm-google-map-container`.
 *
 * ### Example
 * ```typescript
 * import {Component} from 'angular2/core';
 * import {SebmGoogleMap} from 'angular2-google-maps/core';
 *
 * @Component({
 *  selector: 'my-map-cmp',
 *  directives: [SebmGoogleMap],
 *  styles: [`
 *    .sebm-google-map-container {
 *      height: 300px;
 *    }
 * `],
 *  template: `
 *    <sebm-google-map [latitude]="lat" [longitude]="lng" [zoom]="zoom">
 *    </sebm-google-map>
 *  `
 * })
 * ```
 */
let SebmGoogleMap_1;
export let SebmGoogleMap = SebmGoogleMap_1 = class SebmGoogleMap {
    constructor(_elem, _mapsWrapper) {
        this._elem = _elem;
        this._mapsWrapper = _mapsWrapper;
        this._longitude = 0;
        this._latitude = 0;
        this._zoom = 8;
        /**
         * Enables/disables zoom and center on double click. Enabled by default.
         */
        this.disableDoubleClickZoom = false;
        /**
         * Enables/disables all default UI of the Google map. Please note: When the map is created, this
         * value cannot get updated.
         */
        this.disableDefaultUI = false;
        /**
         * If false, disables scrollwheel zooming on the map. The scrollwheel is enabled by default.
         */
        this.scrollwheel = true;
        /**
         * If false, prevents the map from being controlled by the keyboard. Keyboard shortcuts are
         * enabled by default.
         */
        this.keyboardShortcuts = true;
        /**
         * The enabled/disabled state of the Zoom control.
         */
        this.zoomControl = true;
        /**
         * This event emitter gets emitted when the user clicks on the map (but not when they click on a
         * marker or infoWindow).
         */
        this.mapClick = new EventEmitter();
        /**
         * This event emitter gets emitted when the user right-clicks on the map (but not when they click
         * on a marker or infoWindow).
         */
        this.mapRightClick = new EventEmitter();
        /**
         * This event emitter gets emitted when the user double-clicks on the map (but not when they click
         * on a marker or infoWindow).
         */
        this.mapDblClick = new EventEmitter();
        /**
         * This event emitter is fired when the map center changes.
         */
        this.centerChange = new EventEmitter();
        /**
         * This event emitter is fired when the map goes into idle state.
         */
        this.idleChange = new EventEmitter();
    }
    /** @internal */
    ngOnInit() {
        const container = this._elem.nativeElement.querySelector('.sebm-google-map-container-inner');
        this._initMapInstance(container);
    }
    _initMapInstance(el) {
        this._mapsWrapper.createMap(el, {
            center: { lat: this._latitude, lng: this._longitude },
            zoom: this._zoom,
            disableDefaultUI: this.disableDefaultUI,
            backgroundColor: this.backgroundColor,
            draggableCursor: this.draggableCursor,
            draggingCursor: this.draggingCursor,
            keyboardShortcuts: this.keyboardShortcuts,
            zoomControl: this.zoomControl
        });
        this._handleMapCenterChange();
        this._handleMapZoomChange();
        this._handleMapMouseEvents();
        this._handleMapIdleChange();
    }
    /* @internal */
    ngOnChanges(changes) {
        this._updateMapOptionsChanges(changes);
    }
    _updateMapOptionsChanges(changes) {
        let options = {};
        let optionKeys = Object.keys(changes).filter(k => SebmGoogleMap_1._mapOptionsAttributes.indexOf(k) !== -1);
        optionKeys.forEach((k) => { options[k] = changes[k].currentValue; });
        this._mapsWrapper.setMapOptions(options);
    }
    /**
     * Triggers a resize event on the google map instance.
     * Returns a promise that gets resolved after the event was triggered.
     */
    triggerResize() {
        // Note: When we would trigger the resize event and show the map in the same turn (which is a
        // common case for triggering a resize event), then the resize event would not
        // work (to show the map), so we trigger the event in a timeout.
        return new Promise((resolve) => {
            setTimeout(() => { return this._mapsWrapper.triggerMapEvent('resize').then(() => resolve()); });
        });
    }
    /**
     * Sets the zoom level of the map. The default value is `8`.
     */
    set zoom(value) {
        this._zoom = this._convertToDecimal(value, 8);
        if (typeof this._zoom === 'number') {
            this._mapsWrapper.setZoom(this._zoom);
        }
    }
    /**
     * The longitude that sets the center of the map.
     */
    set longitude(value) {
        this._longitude = this._convertToDecimal(value);
        this._updateCenter();
    }
    /**
     * The latitude that sets the center of the map.
     */
    set latitude(value) {
        this._latitude = this._convertToDecimal(value);
        this._updateCenter();
    }
    _convertToDecimal(value, defaultValue = null) {
        if (typeof value === 'string') {
            return parseFloat(value);
        }
        else if (typeof value === 'number') {
            return value;
        }
        return defaultValue;
    }
    _updateCenter() {
        if (typeof this._latitude !== 'number' || typeof this._longitude !== 'number') {
            return;
        }
        this._mapsWrapper.setCenter({
            lat: this._latitude,
            lng: this._longitude,
        });
    }
    _handleMapCenterChange() {
        this._mapsWrapper.subscribeToMapEvent('center_changed').subscribe(() => {
            this._mapsWrapper.getCenter().then((center) => {
                this._latitude = center.lat();
                this._longitude = center.lng();
                this.centerChange.emit({ lat: this._latitude, lng: this._longitude });
            });
        });
    }
    _handleMapZoomChange() {
        this._mapsWrapper.subscribeToMapEvent('zoom_changed').subscribe(() => {
            this._mapsWrapper.getZoom().then((z) => this._zoom = z);
        });
    }
    _handleMapMouseEvents() {
        const events = [
            { name: 'click', emitter: this.mapClick }, { name: 'rightclick', emitter: this.mapRightClick },
            { name: 'dblclick', emitter: this.mapDblClick }
        ];
        events.forEach((e) => {
            this._mapsWrapper.subscribeToMapEvent(e.name).subscribe((event) => {
                const value = { coords: { lat: event.latLng.lat(), lng: event.latLng.lng() } };
                e.emitter.emit(value);
            });
        });
    }
    _handleMapIdleChange() {
        this._mapsWrapper.subscribeToMapEvent('idle').subscribe(() => {
            this.idleChange.emit(null);
        });
    }
};
/**
 * Map option attributes that can change over time
 */
SebmGoogleMap._mapOptionsAttributes = [
    'disableDoubleClickZoom', 'scrollwheel', 'draggableCursor', 'draggingCursor',
    'keyboardShortcuts', 'zoomControl'
];
SebmGoogleMap = SebmGoogleMap_1 = __decorate([
    Component({
        selector: 'sebm-google-map',
        providers: [GoogleMapsAPIWrapper, MarkerManager, InfoWindowManager],
        inputs: [
            'longitude', 'latitude', 'zoom', 'disableDoubleClickZoom', 'disableDefaultUI', 'scrollwheel',
            'backgroundColor', 'draggableCursor', 'draggingCursor', 'keyboardShortcuts', 'zoomControl'
        ],
        outputs: ['mapClick', 'mapRightClick', 'mapDblClick', 'centerChange', 'idleChange'],
        host: { '[class.sebm-google-map-container]': 'true' },
        styles: [`
    .sebm-google-map-container-inner {
      width: inherit;
      height: inherit;
    }
    .sebm-google-map-content {
      display:none;
    }
  `],
        template: `
    <div class='sebm-google-map-container-inner'></div>
    <div class='sebm-google-map-content'>
      <ng-content></ng-content>
    </div>
  `
    }), 
    __metadata('design:paramtypes', [ElementRef, GoogleMapsAPIWrapper])
], SebmGoogleMap);

//# sourceMappingURL=google-map.js.map