interface Transaction {
    from: string
    to: string
    amount: number
}

interface User {
    [id: number]: number
}

export function settleDebts(users: User) {
    const balances = Object.entries(users).map(([name, balance]) => ({ name, balance }));
    const debtors = balances.filter(user => user.balance < 0);
    const creditors = balances.filter(user => user.balance> 0);
    const transactions: Transaction[] = [];
    // console.log('debtors')
    // console.log(debtors)


    // Pair debtors with creditors and settle debts
    debtors.forEach(debtor => {
      while (debtor.balance < 0 && creditors.length > 0) {
        // console.log('creditors')
        // console.log(creditors)
        const creditor = creditors.reduce((a, b) => a.balance > b.balance ? a : b); // Find the creditor that lend the highest amount
        // console.log(creditor)
        const amount = Math.min(-debtor.balance, creditor.balance); //find the minimum amount that
        // console.log(amount)
        debtor.balance += amount;
        creditor.balance -= amount;
        transactions.push({ from: debtor.name, to: creditor.name, amount });
        if (creditor.balance === 0) {
          creditors.splice(creditors.indexOf(creditor), 1);
        }
      }
    });
    // console.log(transactions)
    return transactions;
}

