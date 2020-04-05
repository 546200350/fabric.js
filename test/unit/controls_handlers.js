(function(){
  QUnit.module('fabric.controlHandlers', function(hooks) {
    var eventData, transform;
    var canvas = new fabric.Canvas(null);
    hooks.beforeEach(function() {
      var target = new fabric.Rect({ width: 100, height: 100 });
      canvas.add(target);
      eventData = {
      };
      transform = {
        originX: 'left',
        orginY: 'top',
        target: target,
        corner: 'mr',
      };
    });
    hooks.afterEach(function() {
      canvas.clear();
    });
    QUnit.test('changeWidth changes the width', function(assert) {
      assert.equal(transform.target.width, 100);
      fabric.controlHandlers.changeWidth(eventData, transform, 200, 300);
      assert.equal(transform.target.width, 199);
    });
    QUnit.test('changeWidth changes the width with big strokeWidth', function(assert) {
      transform.target.strokeWidth = 15;
      fabric.controlHandlers.changeWidth(eventData, transform, 200, 300);
      assert.equal(transform.target.width, 185);
    });
    QUnit.test('changeWidth changes the width with big strokeWidth and strokeUniform', function(assert) {
      transform.target.strokeWidth = 15;
      transform.target.strokeUniform = true;
      fabric.controlHandlers.changeWidth(eventData, transform, 200, 300);
      assert.equal(transform.target.width, 185);
    });
    QUnit.test('changeWidth changes the width with big strokeWidth and strokeUniform + scaling', function(assert) {
      transform.target.strokeWidth = 15;
      transform.target.strokeUniform = true;
      transform.target.scaleX = 3;
      fabric.controlHandlers.changeWidth(eventData, transform, 200, 300);
      assert.equal(Math.floor(transform.target.width), 61);
    });
    QUnit.test('changeWidth changes the width with big strokeWidth + scaling', function(assert) {
      transform.target.strokeWidth = 15;
      transform.target.scaleX = 3;
      fabric.controlHandlers.changeWidth(eventData, transform, 200, 300);
      assert.equal(Math.floor(transform.target.width), 51);
    });
    QUnit.test('scalingXOrSkewingY changes scaleX', function(assert) {
      transform.target.scaleX = 1;
      transform.target.strokeWidth = 0;
      fabric.controlHandlers.scalingXOrSkewingY(eventData, transform, 200, 300);
      assert.equal(Math.round(transform.target.scaleX), 2);
    });
    QUnit.test('scalingXOrSkewingY changes skewY if shift pressed', function(assert) {
      transform.target.scaleX = 1;
      transform.target.skewY = 0;
      transform.target.strokeWidth = 0;
      eventData.shiftKey = true;
      fabric.controlHandlers.scalingXOrSkewingY(eventData, transform, 200, 300);
      assert.equal(Math.round(transform.target.skewY), 79);
      assert.equal(Math.round(transform.target.scaleX), 1);
    });
    QUnit.test('scalingXOrSkewingY will fire events on canvas and target', function(assert) {
      var done = assert.async();
      transform.target.scaleX = 1;
      transform.target.canvas.on('object:scaling', function(options) {
        assert.equal(options.target, transform.target);
      });
      transform.target.on('scaling', function(options) {
        assert.deepEqual(options, {
          e: eventData,
          transform: transform,
          pointer: {
            x: 200,
            y: 300,
          },
        });
        done();
      });
      fabric.controlHandlers.scalingXOrSkewingY(eventData, transform, 200, 300);
    });
  });
})();
