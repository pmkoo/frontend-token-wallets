import React, { Component } from 'react';
import { NavLink, withRouter } from 'react-router-dom';
import { Badge, Nav, NavItem, NavLink as RsNavLink, Button } from 'reactstrap';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import classNames from 'classnames';

import nav from './_nav';
import SidebarMinimizer from './../SidebarMinimizer';

class Sidebar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      addressCopiend: false
    };

    this.handleClick = this.handleClick.bind(this);
    this.activeRoute = this.activeRoute.bind(this);
    this.hideMobile = this.hideMobile.bind(this);
  }

  handleClick(e) {
    e.preventDefault();
    e.target.parentElement.classList.toggle('open');
  }

  activeRoute(routeName) {
    return this.props.location.pathname.indexOf(routeName) > -1
      ? 'nav-item nav-dropdown open' : 'nav-item nav-dropdown';
  }

  hideMobile() {
    if (document.body.classList.contains('sidebar-mobile-show')) {
      document.body.classList.toggle('sidebar-mobile-show');
    }
  }

  render() {
    const badge = (badge) => {
      if (badge) {
        const classes = classNames(badge.class);
        return (<Badge className={classes} color={badge.variant}>{badge.text}</Badge>);
      }

      return null;
    };

    // simple wrapper for nav-title item
    const wrapper = (item) =>
      (item.wrapper && item.wrapper.element
        ? (React.createElement(item.wrapper.element, item.wrapper.attributes, item.name))
        : item.name);

    // nav list section title
    const title = (title, key) => {
      const classes = classNames('nav-title', title.class);
      return (<li key={key} className={classes}>{wrapper(title)}</li>);
    };

    // nav list divider
    const divider = (divider, key) => {
      const classes = classNames('divider', divider.class);
      return (<li key={key} className={classes}></li>);
    };

    // nav item with nav link
    const navItem = (item, key) => {
      const classes = {
        item: classNames(item.class),
        link: classNames('nav-link', item.variant ? `nav-link-${item.variant}` : ''),
        icon: classNames(item.icon)
      };

      return (
        navLink(item, key, classes)
      );
    };

    // nav link
    const navLink = (item, key, classes) => {
      const url = item.url ? item.url : '';
      return (
        <NavItem key={key} className={classes.item}>
          { isExternal(url) ?
            <RsNavLink href={url} className={classes.link} active>
              <i className={classes.icon}></i>{item.name}{badge(item.badge)}
            </RsNavLink>
            :
            <NavLink to={url} className={classes.link} activeClassName="active" onClick={this.hideMobile}>
              <i className={classes.icon}></i>{item.name}{badge(item.badge)}
            </NavLink>
          }
        </NavItem>
      );
    };

    // nav dropdown
    const navDropdown = (item, key) => (
      <li key={key} className={this.activeRoute(item.url, this.props)}>
        <a className="nav-link nav-dropdown-toggle" href="#" onClick={this.handleClick}><i className={item.icon}></i>{item.name}</a>
        <ul className="nav-dropdown-items">
          {navList(item.children)}
        </ul>
      </li>);

    const navType = (item, idx) => {
      if (!item.title) {
        if (!item.divider) {
          if (!item.children) {
            return navItem(item, idx);
          }

          return navDropdown(item, idx);
        }

        return divider(item, idx);
      }

      return title(item, idx);
    };

    // nav list
    const navList = (items) => items.map((item, index) => navType(item, index));

    const isExternal = (url) => {
      const link = url ? url.substring(0, 4) : '';
      return link === 'http';
    };

    // sidebar-nav root
    return (
      <div className="sidebar">
        <div className="sidebar-header" style={{ maxWidth: '200px' }}>
          <h5>{this.props.name}</h5>
          <small>{this.props.email}</small>
          <div className="mt-4">
            <h6 style={{ wordWrap: 'break-word' }}>{this.props.wallets[0].address}</h6>
            <CopyToClipboard text={this.props.wallets[0].address}
              onCopy={() => this.setState({ addressCopied: true })}>
              <Button
                color="link"
                size="sm">
                <i className="fa fa-fw fa-clipboard"/> {this.state.addressCopied ? 'Copied!' : 'Copy address'}
              </Button>
            </CopyToClipboard>
            <Button
              onClick={() => this.props.openQrAddressPopup(this.props.wallets[0].address)}
              color="link"
              size="sm">
              <i className="fa fa-fw fa-qrcode"/> Show as QR code
            </Button>
          </div>
        </div>
        <nav className="sidebar-nav">
          <Nav>
            {navList(nav.items)}
            <NavItem>
              <a className="nav-link" onClick={() => this.props.logout()}>
                <i className="fa fa-fw fa-sign-out"></i> Logout
              </a>
            </NavItem>
          </Nav>
        </nav>
        <SidebarMinimizer/>
      </div>
    );
  }
}

const ComponentWithRouter = withRouter(Sidebar);
export default ComponentWithRouter;
