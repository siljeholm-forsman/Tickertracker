import {Popup} from "reactjs-popup"

const InfoPopup = props => {
  return (
    <>
    <Popup
      trigger={<button className="info-button">?</button>}
      on={['hover', 'focus']}
      position="right top"
      closeOnDocumentClick
      className="info"
    >
      {props.content}
    </Popup>
    </>
  )
}

export default InfoPopup