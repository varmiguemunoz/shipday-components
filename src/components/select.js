import '../styles/select.css'

function Select() {
  return (
    <select className="select-container-custom">
      <option className="select-option-text-custom" value={0}>
        1000 deliveries
      </option>
      <option className="select-option-text-custom" value={1}>
        1000
      </option>
      <option>1000 deliveries</option>
      <option>1000 deliveries</option>
    </select>
  )
}

export default Select
