const { DoublyLinkedList, Node } = require("./doublyLinkedList.js")

class CircularDoublyLinkedList extends DoublyLinkedList {
	constructor(vals) {
		super(vals)
		if (!vals.length) {
			this.head = null
			this.length = 0
		}
		let refs = this._createNodes(vals)
		this.head = refs[0]
		this.head.prev = refs[1]
		refs[1].next = this.head
	}
	#getEnd() {
		return this.head.prev
	}
	insert(val, index) {
		if (index > this.length) throw this._invalidIndexError
		if (index === 0) return this._insertStart(val)
		if (index === this.length) return this._insertEnd(val)
		else return this._insertMiddle(val, index)
	}
	_insertStart(val) {
		const end = this.#getEnd()
		super._insertStart(val)
		end.next = this.head
		this.head.prev = end
	}
	_insertEnd(val) {
		const node = new Node(val, this.#getEnd(), this.head)
		this.#getEnd().next = node
		this.head.prev = node
		this.length++
	}
	_insertMiddle(val, index) {
		const node = (index <= Math.floor(this.length / 2)) ?
			this._traverse(this.head,
				"next",
				(node) => node === this.#getEnd(),
				(acc, curr) => curr,
				(node, i) => i === index
			) :
			this._traverse(this.#getEnd(),
				"prev",
				(node) => node === this.head,
				(acc, curr) => curr,
				(node, i) => i === this.length - index + 1
			)
		const newNode = new Node(val, node, node.next)
		node.next = newNode
		newNode.next.prev = newNode
		this.length++
	}
	del(index) {
		if (index > this.length || index === 0) throw this._invalidIndexError
		if (index === 1) return this._delStart()
		if (index === this.length) return this._delEnd()
		else return this._delMiddle(index)
	}
	_delEnd() {
		const end = this.#getEnd()
		const prev = end.prev
		const next = end.next
		prev.next = next
		next.prev = prev
		this.length--
		return end.val
	}
	_delStart() {
		const deletedVal = this._delMiddle(1)
		console.log("head in del end", this.head)
		this.head = this.head.next
		return deletedVal
	}
	_delMiddle(index) {
		const node = (index <= Math.floor(this.length / 2)) ?
			this._traverse(this.head,
				"next",
				(node) => node === this.#getEnd(),
				(acc, curr) => curr,
				(node, i) => i === index
			) :
			this._traverse(this.#getEnd(),
				"prev",
				(node) => node === this.head,
				(acc, curr) => curr,
				(node, i) => i === this.length - index + 1
			)
		node.prev.next = node.next
		node.next.prev = node.prev
		console.log("node", node)
		this.length--
		return node.val
	}
	_getByVal(val) {
		if (this.length === 0) throw this._invalidValError
		const node = this._traverse(this.head,
			"next",
			(node) => node === this.#getEnd(),
			(acc, curr) => curr,
			(node, i) => node.val === val
		)
		if (node) return node
		throw this._invalidValError
	}
	_get(index) {
		const node = (index <= Math.floor(this.length / 2)) ?
			this._traverse(this.head,
				"next",
				(node) => node === this.#getEnd(),
				(acc, curr) => curr,
				(node, i) => i === index
			) :
			this._traverse(this.#getEnd(),
				"prev",
				(node) => node === this.head,
				(acc, curr) => curr,
				(node, i) => i === this.length - index + 1
			)
		if (node) return node.val
		throw this._invalidValError
	}
	getAll() {
		return this._traverse(this.head, "next",
			(node) => node === this.#getEnd(),
			(acc, curr) => [...acc, curr.val],
			(node, i) => true, []
		)
	}
}

module.exports = { CircularDoublyLinkedList, Node }