import {getTrackAnimateCSS} from '../src/mixins/trackHelper';

describe('data-speed-multiplier', function() {
    var spec = {
        left: 100,
        variableWidth: true,
        slideCount: 1,
        slidesToShow: 1,
        slideWidth: 100,
        speed: 100,
        cssEase: false,
        children: [{props: {}}],
        currentSlide: 0
    };
  it('should return default speed', function() {
      var styles = getTrackAnimateCSS(spec);

      expect(styles.transition).toContain('transform 100ms');
  });

  it('should use speed multiplier', function() {
      var styles = getTrackAnimateCSS(Object.assign({}, spec, {children: [{props: {'data-speed-multiplier': 2}}]}));

      expect(styles.transition).toContain('transform 200ms');
  });
});