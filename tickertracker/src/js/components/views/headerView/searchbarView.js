const SearchbarView = props =>
    <input 
      type="text" 
      placeholder="Search stock" 
      id="search-field" 
      value={props.keyword} 
      onChange={e => props.setKeyword(e.target.value)} 
      onKeyDown={event => {if (event.key === "Enter") {
        document.getElementById("search-field").blur();
        props.goToTopResult();
      }}}
      />

export default SearchbarView