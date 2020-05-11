import { getCustomRepository, getRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import TransactionRepository from '../repositories/TransactionsRepository';
import Category from '../models/Category';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    console.log(`Request no Service: ${title}, ${value}, ${type}, ${category}`);
    const categoriesRepository = getRepository(Category);
    const transactionsRepository = getCustomRepository(TransactionRepository);

    console.log(`categoriesRepository: ${categoriesRepository}`);
    console.log(`categoriesRepository: ${transactionsRepository}`);

    const transactionWithSameCategory = await categoriesRepository.findOne({
      where: { title: category },
    });

    console.log(`transactionWithSameCategory: ${transactionWithSameCategory}`);

    if (transactionWithSameCategory) {
      const transaction = transactionsRepository.create({
        title,
        value,
        type,
        category_id: transactionWithSameCategory.id,
      });

      await transactionsRepository.save(transaction);

      return transaction;
    }

    const transactionCategory = await categoriesRepository.create({
      title: category,
    });

    await categoriesRepository.save(transactionCategory);

    console.log(
      `transactionCategory: ${transactionCategory.id}, ${transactionCategory.title}, ${transactionCategory.created_at}`,
    );

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category_id: transactionCategory.id,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
