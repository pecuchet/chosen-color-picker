# Color Range Picker

Inspired by @wieringen's [tinycolorpicker](https://github.com/wieringen/tinycolorpicker), this small library
renders a color circle from a configurable set of colors and can generate a range of shades from the picked color.  
<br>
[Demo](https://pecuchet.github.io/color-range-picker/)

## Install
``` npm i color-range-picker --save ```


## Public properties and methods

| Name | Type | Description | Returns |
| ---- | ---- | ----------- | ------- |
| ``hex`` | accessor | Get the hexadecimal notation of the last chosen color | String |
| ``rgb`` | accessor | Get the rgb notation of the last chosen color | String |
| ``RGBToHex(Array/String)`` | static method | Convert a RGB array or string to hexadecimal string | String |
| ``range(Number)`` | method | Generate a range of colors from the currently picked color | Array |
| ``toggle()`` | method | Show or hide the ui | void |
| ``destroy()`` | method | Remove the UI from the DOM | void |