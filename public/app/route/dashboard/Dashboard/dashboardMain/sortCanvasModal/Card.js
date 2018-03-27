import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { DragSource, DropTarget } from 'react-dnd'
import ItemTypes from './ItemTypes'
import classnames from 'classnames';

const cardSource = {
	beginDrag(props) {
		return {
			id: props.id,
			originalIndex: props.findCard(props.id).index,
		}
	},

	endDrag(props, monitor) {
		const { id: droppedId, originalIndex } = monitor.getItem()
		const didDrop = monitor.didDrop()

		if (!didDrop) {
			props.moveCard(droppedId, originalIndex)
		}
	},
}

const cardTarget = {
	canDrop() {
		return false
	},

	hover(props, monitor) {
		const { id: draggedId } = monitor.getItem()
		const { id: overId } = props

		if (draggedId !== overId) {
			const { index: overIndex } = props.findCard(overId)
			props.moveCard(draggedId, overIndex)
		}
	},
}

@DropTarget(ItemTypes.CARD, cardTarget, connect => ({
	connectDropTarget: connect.dropTarget(),
}))
@DragSource(ItemTypes.CARD, cardSource, (connect, monitor) => ({
	connectDragSource: connect.dragSource(),
	isDragging: monitor.isDragging(),
}))
export default class Card extends PureComponent {
	static propTypes = {
		connectDragSource: PropTypes.func,
		connectDropTarget: PropTypes.func,
		isDragging: PropTypes.bool,
		id: PropTypes.any,
		canvasId: PropTypes.number,
		text: PropTypes.string,
		moveCard: PropTypes.func,
		findCard: PropTypes.func,
		handleSelect:PropTypes.func
	}
	render() {
		const {
			text,
			// isDragging,
			connectDragSource,
			connectDropTarget,
			id,
			canvasId
		} = this.props
		// const opacity = isDragging ? 0 : 1
		let checked = id === canvasId ? true : false;
		let moveCanvasListStyleName = classnames(
			'CanvasListItem',
			{ 'CanvasListItemChoosed': checked }
		);
		return connectDragSource(
			connectDropTarget(
				<div>
					<div style={{
						'width': '100%',
						'position': 'relative',
						'padding': '0 15px',
						'height': '30px',
						'lineHeight': '30px'
					}}
						key={`moveCanvasList${id}`}
						ref={`moveCanvasList${id}`}
						draggable="true"
						onMouseDown={this.props.handleSelect.bind(this)}
						className={moveCanvasListStyleName}>
						{text}
						<span className='CanvasListItemImg'></span>
					</div>
				</div>
			),
		)
	}
}