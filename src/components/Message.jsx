import React, { Fragment } from 'react';

const Messenge = ({ content, name, date, owner }) => {
    return (
        <Fragment>
            {owner ? (<li className="clearfix">
                <div className="message-data align-right">
                    <span className="message-data-time">({date})</span>
                    <span className="message-data-name">{name}</span>
                </div>
                <div className="message other-message float-right">
                    {content}
                </div>
            </li>) :
                (<li>
                    <div className="message-data">
                        <span className="message-data-name">
                            {name}
                </span>
                        <span className="message-data-time">({date})</span>
                    </div>
                    <div className="message my-message">
                    {content}
              </div>
                </li>)}
        </Fragment>


    );
}

export default Messenge;