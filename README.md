# FreeFlowChart

It's a simple component for drawing flow charts. Still got bugs to fix and function to add.

## Usage:
You can simply import this component by including the *FreeFlowChart.min.js* file, without other dependencies.

``<script src="FreeFlowChart.min.js"></script>``

Check directory *example* for more infomation. And a example of usage is shown as below:

``let flowChart = FreeFlowChart({
    el: '#draw-main',
    toolbar: {
      el: '#draw-tools'
    }
  })``

## Options:

You can custom your freeflowchart by change the setting. The options is shown as below:

<table>
  <tr>
    <th>option</th>
    <th>usage</th>
    <th>values</th>
    <th>default</th>
    <th>isNecessary</th>
  </tr>
  <tr>
    <td>el</td>
    <td>the div of component</td>
    <td>div element</td>
    <td>none</td>
    <td>true</td>
  </tr>
  <tr>
    <td>shapes</td>
    <td>enabled shapes</td>
    <td>'process','decision','terminator','storedData'</td>
    <td>all</td>
    <td>false</td>
  </tr>
  <tr>
    <td>toolbar</td>
    <td>toolbar information</td>
    <td>el, tools</td>
    <td>none</td>
    <td>false</td>
  </tr>
</table>

<table>
  <tr>
    <th>toolbar option</th>
    <th>usage</th>
    <th>values</th>
    <th>default</th>
    <th>isNecessary</th>
  </tr>
  <tr>
    <td>el</td>
    <td>the div of toolbar</td>
    <td>div element</td>
    <td>none</td>
    <td>true</td>
  </tr>
  <tr>
    <td>tools</td>
    <td>enabled tools</td>
    <td>'undo', 'redo',
        'bold', 'italic', 'underline',
        'fontFamily', 'fontSize', 'fontColor',
        'fillStyle', 'strokeStyle', 'lineWidth', 'lineDash',
        'linkerType', 'arrowType'</td>
    <td>all</td>
    <td>false</td>
  </tr>
</table>

## Interfaces:

<table>
  <tr>
    <th>function</th>
    <th>usage</th>
    <th>input</th>
    <th>output</th>
  </tr>
  <tr>
    <td>FreeFlowChart</td>
    <td>Create the instance of freeflowchart or return the created instance.</td>
    <td>options / none</td>
    <td>instance</td>
  </tr>
  <tr>
    <td>generateImage</td>
    <td>generate a image of current shapes and lines.</td>
    <td>none</td>
    <td>image object</td>
  </tr>
   <tr>
    <td>clear</td>
    <td>clear canvas.</td>
    <td>none</td>
    <td>none</td>
  </tr>
  <tr>
    <td>getModel</td>
    <td>get the data model of canvas.</td>
    <td>none</td>
    <td>json</td>
  </tr>
   <tr>
    <td>addModel</td>
    <td>add the model info the current canvas.</td>
    <td>model</td>
    <td>none</td>
  </tr>
  <tr>
    <td>setModel</td>
    <td>reset the canvas.</td>
    <td>model</td>
    <td>none</td>
  </tr>
</table>

## Important:

Because this module use singleton pattern to create component. Each page can only have one freeflowchart.
