import React, { Component } from 'react'
import Slider from '../src/slider'

export default class GuestCalendar extends Component {
  componentDidMount() {
      requestAnimationFrame(() => this.refs.slider.slickNext())
  }
  render() {
    const settings = {
      dots: true,
      infinite: false,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      variableWidth: true,
      dots: false,
      swipeToSlide: true,
      initialSlide: 1 // The slide index of the previous day. 
                      // Will slide to current day when `componentDidMount`
    };
    return (
      <div>
        <h2>Guest Calendar</h2>
        <Slider ref="slider" {...settings}>
          <div className="day">
            <h3 className="guest">1</h3>
         </div>
          <div className="day">
            <h3 className="guest">2</h3>
            <h3 className="guest">2</h3>
         </div>
          <div className="day">
            <h3 className="guest">3</h3>
            <h3 className="guest">3</h3>
            <h3 className="guest">3</h3>
         </div>
          <div className="day">
            <h3 className="guest">4</h3>
            <h3 className="guest">4</h3>
            <h3 className="guest">4</h3>
            <h3 className="guest">4</h3>
         </div>
          <div className="day">
            <h3 className="guest">5</h3>
            <h3 className="guest">5</h3>
            <h3 className="guest">5</h3>
            <h3 className="guest">5</h3>
            <h3 className="guest">5</h3>
         </div>
          <div className="day">
            <h3 className="guest">6</h3>
            <h3 className="guest">6</h3>
         </div>
        </Slider>
      </div>
    );
  }
}
