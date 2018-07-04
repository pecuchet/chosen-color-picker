const
    DOC = document,
    DEFAULTS = {
        parent: null,
        target: null,
        size: 150,
        onPick: null,
        colors: [
            '#fd5308',
            '#fb9902',
            '#fabc02',
            '#fefe33',
            '#d0ea2b',
            '#66b032',
            '#0391ce',
            '#0247fe',
            '#3d01a4',
            '#8601af',
            '#a7194b',
            '#fe2712'
        ]
    };

export default class ColorRangePicker {

    /**
     *
     * @param {Object} options
     */
    constructor(options) {
        const msg = (type) => `Provide a 'options.${type}' element to append the color picker to.`;

        options.parent = ColorRangePicker._cacheEl(options.parent);
        options.target = ColorRangePicker._cacheEl(options.target);

        if (!options.parent) throw new TypeError(msg('parent'));
        if (!options.target) throw new TypeError(msg('target'));

        this.opt = Object.assign({}, DEFAULTS, options);

        this.canvas = null;
        this.color = null;

        this._bind();
    }

    /**
     * Store a HTMLElement
     *
     * @param {null|string|HTMLElement} el
     * @return {null|HTMLElement}
     * @private
     */
    static _cacheEl(el) {
        if (!el) return null;
        if (typeof el === 'string') return DOC.querySelector(el);
        if (el.nodeType) return el;
        return null;
    }

    /**
     * Create, style and append the canvas element
     *
     * @private
     * @return ColorRangePicker
     */
    _setup() {
        const options = this.opt,
            parent = options.parent,
            picker = DOC.createElement('canvas'),
            style = picker.style;

        picker.height = picker.width = options.size;

        style.display = 'none';
        style.position = 'absolute';
        style.top = style.left = `-${(options.size / 2) - (parent.clientWidth / 2)}px`;

        ColorRangePicker._draw(picker.getContext('2d'), options.size, options.colors);

        parent.classList.add('has-picker');
        parent.style.position = 'relative';

        parent.appendChild(picker);

        this.canvas = picker;

        return this;
    }

    /**
     * Draw the colour circle
     *
     * @param {CanvasRenderingContext2D} ctx
     * @param {Number} width
     * @param {Array} colors
     * @private
     * @return void
     */
    static _draw(ctx, width, colors = []) {
        const center = width / 2,
            segmentWidth = 360 / colors.length,
            segmentDepth = 30,
            startAt = 270;

        let startAngle = startAt,
            endAngle = startAt + segmentWidth;

        colors.forEach((color, i) => {

            setTimeout(() => {
                ctx.beginPath();
                ctx.arc(center, center, 50, (startAngle * Math.PI / 180), (endAngle * Math.PI / 180), false);
                ctx.lineWidth = segmentDepth;
                ctx.strokeStyle = color;
                ctx.stroke();

                startAngle += segmentWidth;
                endAngle += segmentWidth;

            }, i * 30);
        });
    }

    /**
     * Pick the colour under the cursor
     *
     * @param {HTMLCanvasElement} canvas
     * @param {MouseEvent} e
     * @private
     * @return void
     */
    _pick(canvas, e) {
        const pos = canvas.getBoundingClientRect(),
            colorData = canvas.getContext('2d').getImageData(e.clientX - pos.left, e.clientY - pos.top, 1, 1).data;

        this.color = [colorData[0], colorData[1], colorData[2]];
        this.opt.target.style.backgroundColor = `rgb(${this.color.join(',')})`;

        this.toggle();
    }

    /**
     * Return RGB array of selected colour
     *
     * @return {String}
     */
    get rgb() {
        return this.color ? `rgb(${this.color.join(',')})` : '';
    }

    /**
     * Return HEX value of selected color
     *
     * @return {String}
     */
    get hex() {
        return this.color ? ColorRangePicker.RGBToHex(this.color) : '';
    }

    /**
     * Convert a RGB value to a HEX color
     *
     * @author Tim Down
     * @see https://stackoverflow.com/a/5624139/2125281
     * @param {Array|String} rgb
     * @return {string}
     */
    static RGBToHex(rgb) {
        let parsed = Array.isArray(rgb) ? rgb : rgb.match(/\d+/g),
            hex = (x) => {
                let hex = parseInt(x, 10).toString(16);
                return hex.length === 1 ? '0' + hex : hex;
            };

        return '#' + hex(parsed[0]) + hex(parsed[1]) + hex(parsed[2]);
    }

    /**
     * Convert an RGB value
     *
     * @author Tim Down
     * @see https://stackoverflow.com/a/5624139/2125281
     * @param {String} hex
     * @return {Array|null}
     * @constructor
     */
    static HexToRGB(hex) {
        // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
        let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;

        hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);

        let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

        return result ? [
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16)
        ] : null;
    }

    /**
     * Convert a HEX value to a RGB array
     *
     * @author Pimp Trizkit
     * @see {@link https://stackoverflow.com/a/13542669/2125281|StackOverflow}
     * @param {Array|String} color in RGB or HEX format
     * @param {Number} step
     * @return {Array|null}
     */
    static range(color, step = .1) {
        let range = [];

        color = ColorRangePicker.getFormat(color) === 'HEX'
            ? ColorRangePicker.HexToRGB(color)
            : color;

        if (!color) return null;

        for (let i = -.5; i < .5; i += step) {
            let t = i < 0 ? 0 : 255,
                p = i < 0 ? i * -1 : i,
                R = parseInt(color[0]),
                G = parseInt(color[1]),
                B = parseInt(color[2]);

            range.push('rgb('
                + (Math.round((t - R) * p) + R) + ','
                + (Math.round((t - G) * p) + G) + ','
                + (Math.round((t - B) * p) + B)
                + ')');
        }
        return range;
    }

    /**
     * Check whether it is an RGB or HEX format
     *
     * Other formats are currently not supported. If not hexadecimal,
     * it is assumed it is an RGB array
     *
     * @param color
     * @return {string}
     */
    static getFormat(color) {
        if (typeof color === 'string') return /,/.test(color) ? 'RGB' : 'HEX';
        return 'RGB';
    }

    /**
     * Show or hide the picker
     *
     * @private
     * @return {String}
     */
    toggle() {
        const pStyle = this.canvas.style;
        return pStyle.display = pStyle.display !== 'none' ? 'none' : 'block';
    }

    /**
     * Remove event and references
     *
     * @return void
     */
    destroy() {
        let parent = this.opt.parent;

        parent.classList.remove('has-picker');
        parent.removeEventListener('click', this._click, false);
        this.opt = this.canvas = this.color = null;
    }

    /**
     * Bind click event to parent element
     *
     * @private
     * @return void
     */
    _bind() {
        this.opt.parent.addEventListener('click', this._click = this._click.bind(this), false);
    }

    /**
     * Append the picker and display it or just display it
     *
     * @param {MouseEvent} e
     * @private
     * @return {*}
     */
    _click(e) {
        const target = e.target;

        e.preventDefault();

        if (!this.opt.parent.classList.contains('has-picker')) {
            return this._setup().toggle();
        }

        if (target.nodeName.toLowerCase() === 'canvas') {
            this._pick(target, e);
            if (typeof this.opt.onPick === 'function')
                this.opt.onPick.call(this, this);
            return;
        }

        return this.toggle();
    }
}