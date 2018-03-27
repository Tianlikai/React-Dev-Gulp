import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import update from 'immutability-helper'
import { DropTarget, DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import Card from './Card'
import ItemTypes from './ItemTypes'

const cardTarget = {
	drop() { },
}

@DragDropContext(HTML5Backend)
@DropTarget(ItemTypes.CARD, cardTarget, connect => ({
	connectDropTarget: connect.dropTarget(),
}))
export default class Container extends PureComponent {
	static propTypes = {
		connectDropTarget: PropTypes.func,
		card: PropTypes.node,
		handleConfig: PropTypes.func,
		handleSelect: PropTypes.func,
		canvasListstate: PropTypes.object
	}
	constructor(props) {
		super(props)
		this.moveCard = this.moveCard.bind(this)
		this.findCard = this.findCard.bind(this)
		this.state = {
			cards: this.props.card,
			canvasId: null,
			choosed: false,
		}
	}
	moveCard(id, atIndex) {
		const { card, index } = this.findCard(id)
		this.setState(
			update(this.state, {
				cards: {
					$splice: [[index, 1], [atIndex, 0, card]],
				},
			}), function () {
				this.props.handleConfig(this.state.cards)
			}
		)
	}
	moveUpCard(activeId) {
		const { card, index } = this.findCard(activeId);
		if (index == 0) {
			return
		}
		this.setState(
			update(this.state, {
				cards: {
					$splice: [[index, 1], [index - 1, 0, card]],
				},
			}), function () {
				this.props.handleConfig(this.state.cards)
			}
		)
	}
	moveDownCard(activeId) {
		const { card, index } = this.findCard(activeId);
		let length = this.state.cards.length;
		if (index == length - 1) {
			return
		}
		this.setState(
			update(this.state, {
				cards: {
					$splice: [[index, 1], [index + 1, 0, card]],
				},
			}), function () {
				this.props.handleConfig(this.state.cards)
			}
		)
	}
	findCard(id) {
		const { cards } = this.state
		const card = cards.filter(c => c.id === id)[0]
		return {
			card,
			index: cards.indexOf(card),
		}
	}
	handleSelect(list) {
		this.setState({
			canvasId: list.id,
			choosed: true,
		})
		this.props.handleSelect(list.id, true, '');
	}
	componentWillReceiveProps() {
		let { canvasId, dirction } = this.props.canvasListstate
		if (!dirction) {
			return
		} else if (dirction == 'down') {
			this.moveDownCard(canvasId)
		} else if (dirction == 'up') {
			this.moveUpCard(canvasId)
		}
	}
	render() {
		const { connectDropTarget } = this.props
		const { cards } = this.state
		return connectDropTarget(
			<div >
				{cards.map(card => (
					<Card
						key={card.id}
						id={card.id}
						text={card.name}
						moveCard={this.moveCard}
						findCard={this.findCard}
						canvasId={this.state.canvasId}
						handleSelect={this.handleSelect.bind(this, card)}
					/>
				))}
			</div>,
		)
	}
}