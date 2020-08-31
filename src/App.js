import React from 'react';
import './App.css';


class IngredientRow extends React.Component {
  //const [title, setTitle] = useState('' )



  render() {
    return (
      <tr>
        <td><input type="text" className="name-input" value={this.props.name} onChange={event => this.props.onChange(event.target.value, 'N')}  ></input></td>
        <td><input type="text" className="mesure-input" value={this.props.unit} onChange={event => this.props.onChange(event.target.value, 'U')}></input></td>
        <td><input type="number" className="quant-input" value={this.props.quantity} onChange={event => this.props.onChange(event.target.value, 'Q')}></input></td>
        <td><input type="number" className="result-input" value={this.props.result} onChange={event => this.props.onChange(event.target.value, 'R')}></input></td>
      </tr >

    );
  }
}

class IngredientsTable extends React.Component {

  renderEmptyRow(i) {
    return (
      <IngredientRow
        key={i}
        name=""
        unit=""
        quantity=""
        result=""
        onChange={(value, type) => this.props.onChange(i, value, type)}
      />
    );
  }
  render() {

    const rows = [];


    this.props.ingredients.forEach((ingredient, i) => {

      rows.push(
        <IngredientRow
          key={i}
          name={ingredient.name}
          unit={ingredient.unit}
          quantity={ingredient.quantity}
          result={ingredient.result}
          onChange={(value, type) => this.props.onChange(i, value, type)}
        />
      )
    })


    return (
      <div>
        <table>
          <thead>
            <tr>
              <th>Ingredient</th>
              <th>Unit</th>
              <th>Quantity</th>
              <th>Result</th>
            </tr>
          </thead>
          <tbody>
            {rows}
            {/* {this.renderEmptyRow(this.props.ingredients.length)} */}
          </tbody>
        </table>
      </div>
    );

  }
}

class ScaleFactor extends React.Component {
  render() {

    let buttonTag = this.props.isMulti ? "X" : "/"
    return (
      <div className="scale-factor-board">
        <h2>Ingredients</h2>
        <button onClick={() => { this.props.onClick() }}>{buttonTag}</button>
        <form>
          <input type="number" value={this.props.factor} onChange={event => this.props.onChange(event.target.value)} />
        </form>
      </div>
    );

  }
}



class Main extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      ingredients: [],
      factor: 2,
      isMulti: true
    };
  }


  handleClick() {
    const ingredientList = this.state.ingredients.slice()
    ingredientList.forEach((ingredient, i) => {
      if (ingredient.quantity !== "") {
        if (ingredient.quantity === 0) { ingredient.result = 0 }
        else {
          ingredient.result = this.state.isMulti ?
            (ingredient.quantity / this.state.factor) :
            (ingredient.quantity * this.state.factor);
        }

      }

    });
    console.log("test")
    this.setState({
      ingredients: this.state.ingredients,
      factor: this.state.factor,
      isMulti: !this.state.isMulti
    })


  }

  handleInput(i, value, type) {
    if (type === 'F' || type === 'Q' || type === 'R') {
      let sValue = value.toString();
      value = parseFloat(sValue);
      if (Number.isNaN(value)) { value = 0 }
    }
    if (type === 'F') {

      const ingredientList = this.state.ingredients.slice()
      let factor = value
      ingredientList.forEach((ingredient, i) => {
        if (ingredient.quantity !== "") {
          if (ingredient.quantity === 0) { ingredient.result = 0 }
          else {
            ingredient.result = this.state.isMulti ?
              (ingredient.quantity * factor) :
              (ingredient.quantity / factor);
          }
        }
      })
      this.setState({
        ingredients: ingredientList,
        factor: factor,
        isMulti: this.state.isMulti
      })
    } else {
      let tempName = "";
      let tempUnit = "";
      let tempQuantity = 0;
      let tempResult = 0;
      if (type === 'N') { tempName += value; }
      if (type === 'U') { tempUnit += value; }
      if (type === 'Q') {
        tempQuantity += parseFloat(value);
        tempResult = this.state.isMulti ?
          (tempResult = ((value) * (this.state.factor))) :
          (tempResult = ((value) / (this.state.factor)))
      }
      if (type === 'R') {
        tempResult += parseFloat(value);
        tempQuantity = this.state.isMulti ?
          ((value) / (this.state.factor)) :
          ((value) * (this.state.factor))
      }
      // if the item is new
      if (i >= this.state.ingredients.length) {
        const ingredientList = this.state.ingredients.slice();
        const newIngredient = {
          name: tempName,
          unit: tempUnit,
          quantity: tempQuantity,
          result: tempResult
        };
        ingredientList.push(newIngredient);
        this.setState({
          ingredients: ingredientList,
          factor: this.state.factor,
          isMulti: this.state.isMulti
        });
      }
      // if the item already exists
      else {

        let isDiferent = false;
        if (type === 'N') { if (value !== this.state.ingredients[i].name) isDiferent = true };
        if (type === 'U') { if (value !== this.state.ingredients[i].unit) isDiferent = true };
        if (type === 'Q') { if (value !== this.state.ingredients[i].quantity) isDiferent = true };
        if (type === 'R') { if (value !== this.state.ingredients[i].result) isDiferent = true };

        if (isDiferent) {
          const ingredientList = this.state.ingredients.slice();
          let factor = this.state.factor;


          if (type === 'N') { ingredientList[i].name = (value) };
          if (type === 'U') { ingredientList[i].unit = (value) };
          if (type === 'Q') { ingredientList[i].quantity = parseFloat(value); ingredientList[i].result = this.state.isMulti ? (value) * (this.state.factor) : (value) / (this.state.factor) };
          if (type === 'R') {
            factor = value / ingredientList[i].quantity;
            ingredientList.forEach((ingredient, i) => {
              if (ingredient.quantity !== "") {
                if (ingredient.quantity === 0) { ingredient.result = 0 }
                else {
                  ingredient.result = this.state.isMulti ?
                    ingredient.quantity * factor :
                    ingredient.quantity / factor;
                }
              }
            })
          };

          this.setState({
            ingredients: ingredientList,
            factor: factor,
            isMulti: this.state.isMulti
          })

        }
      }
    }
  }

  addEmptyIngredient() {
    // const ingredientList = this.state.ingredients.slice();
    const newIngredient = {
      name: "",
      unit: "",
      quantity: "",
      result: ""
    };
    this.state.ingredients.push(newIngredient);
    // this.setState({
    //   ingredients: ingredientList,
    //   factor: this.state.factor,
    //   isMulti: this.state.isMulti
    // });
  }

  render() {
    if (!(this.state.ingredients.length > 0)) {
      this.addEmptyIngredient();
    } else if (
      this.state.ingredients[this.state.ingredients.length - 1].name !== "" ||
      this.state.ingredients[this.state.ingredients.length - 1].unit !== "" ||
      this.state.ingredients[this.state.ingredients.length - 1].quantity !== "" ||
      this.state.ingredients[this.state.ingredients.length - 1].result !== "") {
      this.addEmptyIngredient();
    }
    for (let i = 0; i < this.state.ingredients.length - 1; i++) {
      if (this.state.ingredients[i].name === "" &&
        this.state.ingredients[i].unit === "" &&
        this.state.ingredients[i].quantity === "" &&
        this.state.ingredients[i].result === "") {
        this.state.ingredients.splice(i, 1)
      }
    }






    return (
      <div className="main-board" >
        <div className="scale-factor-board-div">
          <ScaleFactor
            isMulti={this.state.isMulti}
            factor={this.state.factor}
            onChange={(value) => this.handleInput(0, value, 'F')}
            onClick={() => this.handleClick()} />
        </div>
        <div className="ingredients-board">
          <IngredientsTable
            ingredients={this.state.ingredients}
            onChange={(i, value, type) => this.handleInput(i, value, type)}
          />
        </div>
      </div>
    );
  }

}



function App() {
  return (
    <div className="App">
      <Main />
    </div>
  );
}

export default App;
