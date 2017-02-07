'use strict';

exports.__esModule = true;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _trackHelper = require('./trackHelper');

var _objectAssign = require('object-assign');

var _objectAssign2 = _interopRequireDefault(_objectAssign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var helpers = {
  initialize: function initialize(props) {
    var slickList = _reactDom2.default.findDOMNode(this.list);

    var slideCount = _react2.default.Children.count(props.children);
    var listWidth = this.getWidth(slickList);
    var trackWidth = this.getWidth(_reactDom2.default.findDOMNode(this.track));
    var slideWidth;

    if (!props.vertical) {
      slideWidth = this.getWidth(_reactDom2.default.findDOMNode(this)) / props.slidesToShow;
    } else {
      slideWidth = this.getWidth(_reactDom2.default.findDOMNode(this));
    }

    var slideHeight = this.getHeight(slickList.querySelector('[data-index="0"]'));
    var listHeight = slideHeight * props.slidesToShow;

    var currentSlide = props.rtl ? slideCount - 1 - props.initialSlide : props.initialSlide;

    this.setState({
      slideCount: slideCount,
      slideWidth: slideWidth,
      listWidth: listWidth,
      trackWidth: trackWidth,
      currentSlide: currentSlide,
      slideHeight: slideHeight,
      listHeight: listHeight
    }, function () {

      var targetLeft = (0, _trackHelper.getTrackLeft)((0, _objectAssign2.default)({
        slideIndex: this.state.currentSlide,
        trackRef: this.track,
        listRef: this.list
      }, props, this.state));
      // getCSS function needs previously set state
      var trackStyle = (0, _trackHelper.getTrackCSS)((0, _objectAssign2.default)({ left: targetLeft }, props, this.state));

      this.setState({ trackStyle: trackStyle });

      this.autoPlay(); // once we're set up, trigger the initial autoplay.
    });
  },
  update: function update(props) {
    var slickList = _reactDom2.default.findDOMNode(this.list);
    // This method has mostly same code as initialize method.
    // Refactor it
    var slideCount = _react2.default.Children.count(props.children);
    var listWidth = this.getWidth(slickList);
    var trackWidth = this.getWidth(_reactDom2.default.findDOMNode(this.track));
    var slideWidth;

    if (!props.vertical) {
      slideWidth = this.getWidth(_reactDom2.default.findDOMNode(this)) / props.slidesToShow;
    } else {
      slideWidth = this.getWidth(_reactDom2.default.findDOMNode(this));
    }

    var slideHeight = this.getHeight(slickList.querySelector('[data-index="0"]'));
    var listHeight = slideHeight * props.slidesToShow;

    // pause slider if autoplay is set to false
    if (!props.autoplay) this.pause();

    this.setState({
      slideCount: slideCount,
      slideWidth: slideWidth,
      listWidth: listWidth,
      trackWidth: trackWidth,
      slideHeight: slideHeight,
      listHeight: listHeight
    }, function () {

      var targetLeft = (0, _trackHelper.getTrackLeft)((0, _objectAssign2.default)({
        slideIndex: this.state.currentSlide,
        trackRef: this.track,
        listRef: this.list
      }, props, this.state));
      // getCSS function needs previously set state
      var trackStyle = (0, _trackHelper.getTrackCSS)((0, _objectAssign2.default)({ left: targetLeft }, props, this.state));

      this.setState({ trackStyle: trackStyle });
    });
  },
  getWidth: function getWidth(elem) {
    return elem.getBoundingClientRect().width || elem.offsetWidth;
  },
  getHeight: function getHeight(elem) {
    return elem.getBoundingClientRect().height || elem.offsetHeight;
  },

  adaptHeight: function adaptHeight() {
    if (this.props.adaptiveHeight) {
      var selector = '[data-index="' + this.state.currentSlide + '"]';
      if (this.list) {
        var slickList = _reactDom2.default.findDOMNode(this.list);
        slickList.style.height = slickList.querySelector(selector).offsetHeight + 'px';
      }
    }
  },
  slideHandler: function slideHandler(index) {
    var _this = this;

    // Functionality of animateSlide and postSlide is merged into this function
    // console.log('slideHandler', index);
    var targetSlide, currentSlide;
    var targetLeft, currentLeft;
    var callback;
    var previousSlide = this.state.currentSlide;

    if (this.props.waitForAnimate && this.state.animating) {
      // Fix for NBC: We needed to reset the animating state here so that
      // future calls to slideHandler() would work.
      this.setState({
        animating: false
      });
      return;
    }

    if (this.props.fade) {
      currentSlide = this.state.currentSlide;

      // Don't change slide if it's not infite and current slide is the first or last slide.
      if (this.props.infinite === false && (index < 0 || index >= this.state.slideCount)) {
        return;
      }

      //  Shifting targetSlide back into the range
      if (index < 0) {
        targetSlide = index + this.state.slideCount;
      } else if (index >= this.state.slideCount) {
        targetSlide = index - this.state.slideCount;
      } else {
        targetSlide = index;
      }

      if (this.props.lazyLoad && this.state.lazyLoadedList.indexOf(targetSlide) < 0) {
        this.setState({
          lazyLoadedList: this.state.lazyLoadedList.concat(targetSlide)
        });
      }

      var multiplier = (0, _trackHelper.getMultiplier)((0, _objectAssign2.default)({}, this.props, { currentSlide: currentSlide }));

      callback = function callback() {
        _this.setState({
          animating: false
        });
        _this.afterChange(_this.state.previousSlide, _this.state.currentSlide);
        delete _this.animationEndCallback;
      };

      this.setState({
        animating: true,
        currentSlide: targetSlide,
        previousSlide: previousSlide
      }, function () {
        this.animationEndCallback = setTimeout(callback, this.props.speed * multiplier);
      });

      if (this.props.beforeChange) {
        this.props.beforeChange(this.state.currentSlide, targetSlide);
      }

      this.autoPlay();
      return;
    }

    targetSlide = index;
    if (targetSlide < 0) {
      if (this.props.infinite === false) {
        currentSlide = 0;
      } else if (this.state.slideCount % this.props.slidesToScroll !== 0) {
        currentSlide = this.state.slideCount - this.state.slideCount % this.props.slidesToScroll;
      } else {
        currentSlide = this.state.slideCount + targetSlide;
      }
    } else if (targetSlide >= this.state.slideCount) {
      if (this.props.infinite === false) {
        currentSlide = this.state.slideCount - this.props.slidesToShow;
      } else if (this.state.slideCount % this.props.slidesToScroll !== 0) {
        currentSlide = 0;
      } else {
        currentSlide = targetSlide - this.state.slideCount;
      }
    } else {
      currentSlide = targetSlide;
    }

    targetLeft = (0, _trackHelper.getTrackLeft)((0, _objectAssign2.default)({
      slideIndex: targetSlide,
      trackRef: this.track,
      listRef: this.list
    }, this.props, this.state));

    currentLeft = (0, _trackHelper.getTrackLeft)((0, _objectAssign2.default)({
      slideIndex: currentSlide,
      trackRef: this.track,
      listRef: this.list
    }, this.props, this.state));

    if (this.props.infinite === false) {
      targetLeft = currentLeft;
    }

    if (this.props.beforeChange) {
      this.props.beforeChange(this.state.currentSlide, currentSlide);
    }

    if (this.props.lazyLoad) {
      var loaded = true;
      var slidesToLoad = [];
      for (var i = targetSlide; i < targetSlide + this.props.slidesToShow; i++) {
        loaded = loaded && this.state.lazyLoadedList.indexOf(i) >= 0;
        if (!loaded) {
          slidesToLoad.push(i);
        }
      }
      if (!loaded) {
        this.setState({
          lazyLoadedList: this.state.lazyLoadedList.concat(slidesToLoad)
        });
      }
    }

    // Slide Transition happens here.
    // animated transition happens to target Slide and
    // non - animated transition happens to current Slide
    // If CSS transitions are false, directly go the current slide.

    if (this.props.useCSS === false) {

      this.setState({
        currentSlide: currentSlide,
        trackStyle: (0, _trackHelper.getTrackCSS)((0, _objectAssign2.default)({ left: currentLeft }, this.props, this.state))
      }, function () {
        if (this.props.afterChange) {
          this.props.afterChange(currentSlide);
        }
      });
    } else {

      var nextStateChanges = {
        animating: false,
        currentSlide: currentSlide,
        trackStyle: (0, _trackHelper.getTrackCSS)((0, _objectAssign2.default)({ left: currentLeft }, this.props, this.state)),
        swipeLeft: null
      };

      var multiplier = (0, _trackHelper.getMultiplier)((0, _objectAssign2.default)({}, this.props, { currentSlide: currentSlide }));

      callback = function callback() {
        _this.setState(nextStateChanges);
        _this.afterChange(_this.state.previousSlide, currentSlide);
        delete _this.animationEndCallback;
      };

      this.setState({
        animating: true,
        previousSlide: previousSlide,
        currentSlide: currentSlide,
        trackStyle: (0, _trackHelper.getTrackAnimateCSS)((0, _objectAssign2.default)({}, this.props, this.state, { currentSlide: currentSlide, left: targetLeft }))
      }, function () {
        this.animationEndCallback = setTimeout(callback, this.props.speed * multiplier);
      });
    }

    this.autoPlay();
  },
  afterChange: function afterChange(previousSlide, currentSlide) {
    var _this2 = this;

    var callback;

    if (this.props.endRightEdge && !this.props.infinite && this.list && this.track) {
      var _getLastSlideVisibili = (0, _trackHelper.getLastSlideVisibility)((0, _objectAssign2.default)({ listRef: this.list, trackRef: this.track }, this.props)),
          partiallyVisible = _getLastSlideVisibili.partiallyVisible,
          rightVisible = _getLastSlideVisibili.rightVisible,
          lastSlideLeft = _getLastSlideVisibili.lastSlideLeft;

      if (!partiallyVisible && rightVisible) {
        var nextStateChanges = {
          animating: false,
          currentSlide: currentSlide,
          trackStyle: (0, _trackHelper.getTrackCSS)((0, _objectAssign2.default)({ left: lastSlideLeft }, this.props, this.state)),
          swipeLeft: null
        };
        callback = function callback() {
          _this2.setState(nextStateChanges);
          if (_this2.props.afterChange) {
            _this2.props.afterChange(currentSlide);
          }
          delete _this2.animationEndCallback;
        };
        this.setState({
          animating: true,
          trackStyle: (0, _trackHelper.getTrackAnimateCSS)((0, _objectAssign2.default)({ left: lastSlideLeft }, this.props, this.state))
        }, function () {
          _this2.animationEndCallback = setTimeout(callback, _this2.props.speed);
        });
      } else {
        if (this.props.afterChange) {
          this.props.afterChange(currentSlide);
        }
      }
    } else {
      if (this.props.afterChange) {
        this.props.afterChange(currentSlide);
      }
    }
  },
  swipeDirection: function swipeDirection(touchObject) {
    var xDist, yDist, r, swipeAngle;

    xDist = touchObject.startX - touchObject.curX;
    yDist = touchObject.startY - touchObject.curY;
    r = Math.atan2(yDist, xDist);

    swipeAngle = Math.round(r * 180 / Math.PI);
    if (swipeAngle < 0) {
      swipeAngle = 360 - Math.abs(swipeAngle);
    }
    if (swipeAngle <= 45 && swipeAngle >= 0 || swipeAngle <= 360 && swipeAngle >= 315) {
      return this.props.rtl === false ? 'left' : 'right';
    }
    if (swipeAngle >= 135 && swipeAngle <= 225) {
      return this.props.rtl === false ? 'right' : 'left';
    }
    if (this.props.verticalSwiping === true) {
      if (swipeAngle >= 35 && swipeAngle <= 135) {
        return 'down';
      } else {
        return 'up';
      }
    }

    return 'vertical';
  },
  autoPlay: function autoPlay() {
    var _this3 = this;

    if (this.state.autoPlayTimer) {
      return;
    }
    var play = function play() {
      if (_this3.state.mounted) {
        var nextIndex = _this3.props.rtl ? _this3.state.currentSlide - _this3.props.slidesToScroll : _this3.state.currentSlide + _this3.props.slidesToScroll;
        _this3.slideHandler(nextIndex);
      }
    };
    if (this.props.autoplay) {
      this.setState({
        autoPlayTimer: setInterval(play, this.props.autoplaySpeed)
      });
    }
  },
  pause: function pause() {
    if (this.state.autoPlayTimer) {
      clearInterval(this.state.autoPlayTimer);
      this.setState({
        autoPlayTimer: null
      });
    }
  }
};

exports.default = helpers;