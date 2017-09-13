import PropTypes from 'prop-types';
import React from 'react';
import ReactART from 'react-art';

var Shape = ReactART.Shape;
var Path = ReactART.Path;

/**
 * Rectangle is a React component for drawing rectangles. Like other ReactART
 * components, it must be used in a <Surface>.
 */
class Rectangle extends React.Component {
    render() {
        var width = this.props.width;
        var height = this.props.height;
        var radius = this.props.radius ? this.props.radius : 0;

        // if unspecified, radius(Top|Bottom)(Left|Right) defaults to the radius
        // property
        var tl = this.props.radiusTopLeft ? this.props.radiusTopLeft : radius;
        var tr = this.props.radiusTopRight ? this.props.radiusTopRight : radius;
        var br = this.props.radiusBottomRight ? this.props.radiusBottomRight : radius;
        var bl = this.props.radiusBottomLeft ? this.props.radiusBottomLeft : radius;

        var path = Path();

        // for negative width/height, offset the rectangle in the negative x/y
        // direction. for negative radius, just default to 0.
        if (width < 0) {
            path.move(width, 0);
            width = -width;
        }
        if (height < 0) {
            path.move(0, height);
            height = -height;
        }
        if (tl < 0) {
            tl = 0;
        }
        if (tr < 0) {
            tr = 0;
        }
        if (br < 0) {
            br = 0;
        }
        if (bl < 0) {
            bl = 0;
        }

        // disable border radius if it doesn't fit within the specified
        // width/height
        if (tl + tr > width) {
            tl = 0;tr = 0;
        }
        if (bl + br > width) {
            bl = 0;br = 0;
        }
        if (tl + bl > height) {
            tl = 0;bl = 0;
        }
        if (tr + br > height) {
            tr = 0;br = 0;
        }

        path.move(0, tl);

        if (tl > 0) {
            path.arc(tl, -tl);
        }
        path.line(width - (tr + tl), 0);

        if (tr > 0) {
            path.arc(tr, tr);
        }
        path.line(0, height - (tr + br));

        if (br > 0) {
            path.arc(-br, br);
        }
        path.line(-width + (br + bl), 0);

        if (bl > 0) {
            path.arc(-bl, -bl);
        }
        path.line(0, -height + (bl + tl));

        return React.createElement(Shape, Object.assign({}, this.props, { d: path }));
    }
}

Rectangle.propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    radius: PropTypes.number,
    radiusTopLeft: PropTypes.number,
    radiusTopRight: PropTypes.number,
    radiusBottomRight: PropTypes.number,
    radiusBottomLeft: PropTypes.number
}

export default Rectangle;
