# Color Range Picker

Inspired by @wieringen's [tinycolorpicker](https://github.com/wieringen/tinycolorpicker) this small library
generates a color circle from a configurable set of colors and can generate a range of shades from the picked color.


## Install
``` npm i color-range-picker -D ```


## Public properties and methods

| Name | Type | Description | Returns |
| ---- | ---- | ----------- | ------- |
| ``hex`` | accessor | Get the hexadecimal notation of the last chosen color | String |
| ``rgb`` | accessor | Get the rgb notation of the last chosen color | String |
| ``RGBToHex`` | static method | Convert a RGB array or string to hexadecimal string | String |
| ``range`` | method | Generate a range of 10 colors from the currently picked color | Array |
| ``toggle`` | method | Show or hide the ui | void |
| ``destroy`` | method | Remove the UI from the DOM | void |