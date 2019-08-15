import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import backImg from '../../assets/images/page_list.png';
import arrow from '../../assets/images/down_arrow.png';
import './index.scss';

class Dropdown extends Component {

  constructor(props) {
    super(props)

    this.state = {
      isDropdown: false,
      dropList: props.options,
      selectedValue: props.selectedValue
    }

    this.mounted = true
    this.handleDocumentClick = this.handleDocumentClick.bind(this)
  }

  componentDidMount () {
    document.addEventListener('click', this.handleDocumentClick, false)
    document.addEventListener('touchend', this.handleDocumentClick, false)
  }

  componentWillUnmount () {
    this.mounted = false
    document.removeEventListener('click', this.handleDocumentClick, false)
    document.removeEventListener('touchend', this.handleDocumentClick, false)
  }

  handleDocumentClick (event) {
    if (this.mounted) {
      
      if (!ReactDOM.findDOMNode(this).contains(event.target)) {
        this.setState({ isDropdown: false })
      }
    }
  }

  onSelect() {
    let st = this.state.isDropdown;
    this.setState({isDropdown: !st})
  }

  onSelectItem(selectedItem){
    this.setState({
      selectedValue: selectedItem,
      isDropdown: false
    })
    this.props.changeEvent(selectedItem);
  }

  componentWillReceiveProps(newProps){
    this.setState({selectedValue: newProps.selectedValue})
  }

  render() {
    return ( 
      <div className="dropdown" onClick={this.onSelect.bind(this)}>
        <div className="dropdown-current">
          <div className="control">
            <img src={backImg} className="control-back" alt="" />
            <div className="control-input">
              <span>{this.state.selectedValue.label}</span>
            </div>
          </div>
          <div className="dropdown-arrow">
            <img src={arrow} className="arrow" alt=""/>
          </div>
        </div>
        {
          this.state.isDropdown ? (
            <div className="dropdown-select">
              <ul className="select-list">
                {
                  this.state.dropList.map((item, index) => {
                    return <li onClick={this.onSelectItem.bind(this, item)} className={index === this.state.selectedValue.value ? "active" : ""} key={index}>{item.label}</li>
                  })
                }
              </ul>
            </div>
          ) : (null)
        }
      </div>
    )
  }
}

export default Dropdown;