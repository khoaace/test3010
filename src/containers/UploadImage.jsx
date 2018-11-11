import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose, withHandlers, setPropTypes } from "recompose";
import { firebaseConnect } from "react-redux-firebase";

// Path within Database for metadata (also used for file Storage path)
const filesPath = "uploadedFiles";

const handlers = {
  onFilesDrop: props => file => {
    let r = Math.random()
      .toString(36)
      .substring(7);
    var ind2 = file.name.lastIndexOf(".");
    let teststring = r + file.name.substring(ind2);
    var blob = file.slice(0, -1, file.type);
    let newFile = new File([blob], teststring, {
      type: file.type
    });
    props.firebase
      .uploadFile(filesPath, newFile, filesPath)
      .then(() => {
        alert("Your image is uploaded !");
      })
      .catch(error => {
        props.getNameImage(teststring);
      });
  },
  onFileDelete: props => (file, key) => {
    return props.firebase.deleteFile(file.fullPath, `${filesPath}/${key}`);
  }
};

const enhancerPropsTypes = {
  firebase: PropTypes.object.isRequired
};

const enhance = compose(
  firebaseConnect([{ path: filesPath }]),
  connect(({ firebase: { data } }) => ({
    uploadedFiles: data[filesPath]
  })),
  setPropTypes(enhancerPropsTypes),
  withHandlers(handlers)
);

const Uploader = ({ firebase, uploadedFiles, onFileDelete, onFilesDrop }) => {
  return (
    <div>
      <input
        type="file"
        name="uploadfile"
        onChange={e => onFilesDrop(e.target.files[0])}
      />
    </div>
  );
};

Uploader.propTypes = {
  firebase: PropTypes.object.isRequired,
  uploadedFiles: PropTypes.object
};

// Apply enhancer to component on export
export default enhance(Uploader);
