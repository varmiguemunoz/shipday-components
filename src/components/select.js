import '../styles/select.css'

function Select() {
  return (
    <div className="div-container-select-custom">
      <select className="select-container-custom">
        <option className="select-option-text-custom" value={1}>
          Hola mundo
        </option>
      </select>
      <div className='image-select-container-custom'>
        <img src="./expand-arrow.svg" alt="icon" />
      </div>
    </div>
  )
}

export default Select
